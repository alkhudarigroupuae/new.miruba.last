import { Router, type Request, type Response } from "express";
import { getActiveConfig } from "./settings";

const router = Router();

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000;
const ADMIN_PASSWORD = process.env.SESSION_SECRET || "admin123";

function requireAdminToken(req: Request, res: Response): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  const token = authHeader.slice(7);
  if (token !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return false;
  }
  return true;
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

function hasWooCredentials() {
  const config = getActiveConfig();
  return Boolean(config.storeUrl && config.consumerKey && config.consumerSecret);
}

async function fetchWithWooAuthFallback(url: URL, init: RequestInit = {}): Promise<Response> {
  const config = getActiveConfig();
  if (!config.storeUrl || !config.consumerKey || !config.consumerSecret) {
    throw new Error("WooCommerce credentials are not configured");
  }

  const baseHeaders = init.headers ? new Headers(init.headers) : new Headers();
  const basicHeaders = new Headers(baseHeaders);
  basicHeaders.set("Authorization", `Basic ${Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64")}`);

  const basicRes = await fetch(url.toString(), { ...init, headers: basicHeaders });
  if (basicRes.status !== 401) return basicRes;

  const keyQueryUrl = new URL(url.toString());
  keyQueryUrl.searchParams.set("consumer_key", config.consumerKey);
  keyQueryUrl.searchParams.set("consumer_secret", config.consumerSecret);
  return fetch(keyQueryUrl.toString(), { ...init, headers: baseHeaders });
}

async function wcFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const config = getActiveConfig();
  if (!hasWooCredentials()) {
    throw new Error("WooCommerce credentials are not configured");
  }
  const url = new URL(`/wp-json/wc/v3${endpoint}`, config.storeUrl);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetchWithWooAuthFallback(url);
  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status}`);
  }
  return (await res.json()) as T;
}

async function wcFetchCached<T>(endpoint: string, params: Record<string, string> = {}) {
  const sortedParams = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  const cacheKey = `${endpoint}?${sortedParams.map(([k, v]) => `${k}=${v}`).join("&")}`;

  const cached = getCached<T>(cacheKey);
  if (cached) return { data: cached, fromCache: true };

  const data = await wcFetch<T>(endpoint, params);
  setCache(cacheKey, data);
  return { data, fromCache: false };
}

async function wcPost<T>(endpoint: string, body: unknown): Promise<T> {
  const config = getActiveConfig();
  if (!hasWooCredentials()) {
    throw new Error("WooCommerce credentials are not configured");
  }
  const url = new URL(`/wp-json/wc/v3${endpoint}`, config.storeUrl);
  const res = await fetchWithWooAuthFallback(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`WooCommerce API error: ${res.status} - ${errorText}`);
  }
  return (await res.json()) as T;
}

interface OrderRequestBody {
  billing: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address_1?: string;
    city?: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
  customer_note?: string;
}

interface WcOrderResponse {
  id: number;
  payment_url?: string;
  order_key: string;
  total: string;
}

router.get("/wc/products", async (req: Request, res: Response) => {
  if (!hasWooCredentials()) {
    return res.status(503).json({ error: "WooCommerce credentials are not configured" });
  }
  try {
    const params: Record<string, string> = { per_page: "100" };
    if (req.query.category) params.category = String(req.query.category);
    if (req.query.per_page) params.per_page = String(req.query.per_page);
    if (req.query.page) params.page = String(req.query.page);
    if (req.query.featured) params.featured = String(req.query.featured);
    if (req.query.slug) params.slug = String(req.query.slug);
    const { data, fromCache } = await wcFetchCached("/products", params);
    res.set("X-Cache", fromCache ? "HIT" : "MISS");
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=30");
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch WooCommerce products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/wc/products/:id", async (req: Request, res: Response) => {
  if (!hasWooCredentials()) {
    return res.status(503).json({ error: "WooCommerce credentials are not configured" });
  }
  try {
    const { data, fromCache } = await wcFetchCached(`/products/${req.params.id}`);
    res.set("X-Cache", fromCache ? "HIT" : "MISS");
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=30");
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch WooCommerce product");
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.get("/wc/categories", async (_req: Request, res: Response) => {
  if (!hasWooCredentials()) {
    return res.status(503).json({ error: "WooCommerce credentials are not configured" });
  }
  try {
    const { data, fromCache } = await wcFetchCached("/products/categories", { per_page: "100" });
    res.set("X-Cache", fromCache ? "HIT" : "MISS");
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=30");
    res.json(data);
  } catch (err) {
    _req.log.error({ err }, "Failed to fetch WooCommerce categories");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/wc/orders", async (req: Request, res: Response) => {
  try {
    const { billing, line_items, customer_note } = req.body as OrderRequestBody;

    if (!billing || !Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ error: "Invalid order payload" });
    }

    const orderData = {
      payment_method: "ngenius",
      payment_method_title: "N-Genius Online Payment",
      set_paid: false,
      billing: {
        first_name: billing.first_name || "",
        last_name: billing.last_name || "",
        email: billing.email || "",
        phone: billing.phone || "",
        address_1: billing.address_1 || "",
        city: billing.city || "",
        country: "AE",
      },
      shipping: {
        first_name: billing.first_name || "",
        last_name: billing.last_name || "",
        address_1: billing.address_1 || "",
        city: billing.city || "",
        country: "AE",
      },
      line_items: line_items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      customer_note: customer_note || "",
    };

    const order = await wcPost<WcOrderResponse>("/orders", orderData);

    req.log.info({ order_id: order.id, payment_url: order.payment_url, order_key: order.order_key }, "WooCommerce order created");

    let checkoutUrl = order.payment_url || "";

    if (!checkoutUrl) {
      const config = getActiveConfig();
      checkoutUrl = `${config.storeUrl}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;
    }

    res.set("Cache-Control", "no-store");
    return res.json({
      success: true,
      order_id: order.id,
      order_key: order.order_key,
      total: order.total,
      checkout_url: checkoutUrl,
    });
  } catch (err: any) {
    req.log.error({ err }, "Failed to create WooCommerce order");
    return res.status(500).json({ error: "Failed to create order", details: err.message });
  }
});

router.post("/wc/cache/clear", async (_req: Request, res: Response) => {
  if (!requireAdminToken(_req, res)) return;
  cache.clear();
  res.json({ success: true, message: "Cache cleared" });
});

export default router;
