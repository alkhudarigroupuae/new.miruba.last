import { Router, type Request, type Response } from "express";
import { getActiveConfig } from "./settings";

const router = Router();

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function wcFetch(endpoint: string, params: Record<string, string> = {}) {
  const config = getActiveConfig();
  const url = new URL(`/wp-json/wc/v3${endpoint}`, config.storeUrl);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });
  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status}`);
  }
  return res.json();
}

async function wcFetchCached(endpoint: string, params: Record<string, string> = {}) {
  const sortedParams = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  const cacheKey = `${endpoint}?${sortedParams.map(([k, v]) => `${k}=${v}`).join("&")}`;

  const cached = getCached(cacheKey);
  if (cached) return { data: cached, fromCache: true };

  const data = await wcFetch(endpoint, params);
  setCache(cacheKey, data);
  return { data, fromCache: false };
}

async function wcPost(endpoint: string, body: any) {
  const config = getActiveConfig();
  const url = new URL(`/wp-json/wc/v3${endpoint}`, config.storeUrl);
  const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`WooCommerce API error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

router.get("/wc/products", async (req: Request, res: Response) => {
  try {
    const params: Record<string, string> = { per_page: "100" };
    if (req.query.category) params.category = String(req.query.category);
    if (req.query.per_page) params.per_page = String(req.query.per_page);
    if (req.query.page) params.page = String(req.query.page);
    if (req.query.featured) params.featured = String(req.query.featured);
    if (req.query.slug) params.slug = String(req.query.slug);
    const { data, fromCache } = await wcFetchCached("/products", params);
    res.set("X-Cache", fromCache ? "HIT" : "MISS");
    res.set("Cache-Control", "public, max-age=300");
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch WooCommerce products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/wc/products/:id", async (req: Request, res: Response) => {
  try {
    const { data, fromCache } = await wcFetchCached(`/products/${req.params.id}`);
    res.set("X-Cache", fromCache ? "HIT" : "MISS");
    res.set("Cache-Control", "public, max-age=300");
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch WooCommerce product");
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.get("/wc/categories", async (_req: Request, res: Response) => {
  try {
    const { data, fromCache } = await wcFetchCached("/products/categories", { per_page: "100" });
    res.set("X-Cache", fromCache ? "HIT" : "MISS");
    res.set("Cache-Control", "public, max-age=300");
    res.json(data);
  } catch (err) {
    _req.log.error({ err }, "Failed to fetch WooCommerce categories");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/wc/orders", async (req: Request, res: Response) => {
  try {
    const { billing, line_items, customer_note } = req.body;

    const orderData: any = {
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
      line_items: line_items.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      customer_note: customer_note || "",
    };

    const order = await wcPost("/orders", orderData);

    req.log.info({ order_id: order.id, payment_url: order.payment_url, order_key: order.order_key }, "WooCommerce order created");

    let checkoutUrl = order.payment_url || "";

    if (!checkoutUrl) {
      const config = getActiveConfig();
      checkoutUrl = `${config.storeUrl}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;
    }

    res.set("Cache-Control", "no-store");
    res.json({
      success: true,
      order_id: order.id,
      order_key: order.order_key,
      total: order.total,
      checkout_url: checkoutUrl,
    });
  } catch (err: any) {
    req.log.error({ err }, "Failed to create WooCommerce order");
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
});

router.post("/wc/cache/clear", async (_req: Request, res: Response) => {
  cache.clear();
  res.json({ success: true, message: "Cache cleared" });
});

export default router;
