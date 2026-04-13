import { Router, type Request, type Response } from "express";

const router = Router();

const WC_STORE_URL = process.env.WC_STORE_URL || "https://admin.mirruba-jewellery.com";
const WC_KEY = process.env.WC_CONSUMER_KEY || "";
const WC_SECRET = process.env.WC_CONSUMER_SECRET || "";

async function wcFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`/wp-json/wc/v3${endpoint}`, WC_STORE_URL);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
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

router.get("/wc/products", async (req: Request, res: Response) => {
  try {
    const params: Record<string, string> = { per_page: "100" };
    if (req.query.category) params.category = String(req.query.category);
    if (req.query.per_page) params.per_page = String(req.query.per_page);
    if (req.query.page) params.page = String(req.query.page);
    if (req.query.featured) params.featured = String(req.query.featured);
    if (req.query.slug) params.slug = String(req.query.slug);
    const data = await wcFetch("/products", params);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch WooCommerce products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/wc/products/:id", async (req: Request, res: Response) => {
  try {
    const data = await wcFetch(`/products/${req.params.id}`);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch WooCommerce product");
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.get("/wc/categories", async (_req: Request, res: Response) => {
  try {
    const data = await wcFetch("/products/categories", { per_page: "100" });
    res.json(data);
  } catch (err) {
    _req.log.error({ err }, "Failed to fetch WooCommerce categories");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
