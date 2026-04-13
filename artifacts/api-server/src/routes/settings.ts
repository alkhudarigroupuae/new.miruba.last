import { Router, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const CONFIG_PATH = path.join(process.cwd(), ".wc-config.json");
const ALLOW_FILE_CONFIG = process.env.NODE_ENV !== "production" || process.env.ALLOW_FILE_CONFIG === "true";

interface StoreSettings {
  storeName: string;
  tagline: string;
  currency: string;
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  developerName: string;
  developerUrl: string;
}

interface WcConfig {
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
  store?: StoreSettings;
}

interface RemoteStoreInfo {
  storeName?: string;
  tagline?: string;
  currency?: string;
  contactEmail?: string;
  address?: string;
}

function readConfig(): WcConfig {
  const envConfig: WcConfig = {
    storeUrl: process.env.WC_STORE_URL || "https://admin.mirruba-jewellery.com",
    consumerKey: process.env.WC_CONSUMER_KEY || "",
    consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  };

  if (!ALLOW_FILE_CONFIG) {
    return envConfig;
  }

  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
      const fileConfig = JSON.parse(raw) as Partial<WcConfig>;
      return {
        ...envConfig,
        ...fileConfig,
        store: fileConfig.store,
      };
    }
  } catch {}
  return envConfig;
}

function writeConfig(config: WcConfig): void {
  if (!ALLOW_FILE_CONFIG) {
    return;
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

export function getActiveConfig(): WcConfig {
  return readConfig();
}

function baseUrl(rawUrl: string): string {
  return rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
}

function wcCredentials(config: WcConfig): string {
  return Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
}

async function fetchWpPublicInfo(storeUrl: string): Promise<RemoteStoreInfo> {
  try {
    const res = await fetch(`${baseUrl(storeUrl)}/wp-json`);
    if (!res.ok) return {};
    const data = (await res.json()) as { name?: string; description?: string };
    return {
      storeName: data.name,
      tagline: data.description,
    };
  } catch {
    return {};
  }
}

async function fetchWooGeneralSettings(config: WcConfig): Promise<Record<string, string>> {
  if (!config.storeUrl || !config.consumerKey || !config.consumerSecret) return {};
  try {
    const res = await fetch(`${baseUrl(config.storeUrl)}/wp-json/wc/v3/settings/general`, {
      headers: { Authorization: `Basic ${wcCredentials(config)}` },
    });
    if (!res.ok) return {};
    const settings = (await res.json()) as Array<{ id?: string; value?: unknown }>;
    const map: Record<string, string> = {};
    for (const item of settings) {
      if (item.id && typeof item.value === "string") {
        map[item.id] = item.value;
      }
    }
    return map;
  } catch {
    return {};
  }
}

async function getRemoteStoreInfo(config: WcConfig): Promise<RemoteStoreInfo> {
  const [wpInfo, wooSettings] = await Promise.all([
    fetchWpPublicInfo(config.storeUrl),
    fetchWooGeneralSettings(config),
  ]);

  const addressParts = [
    wooSettings.woocommerce_store_address,
    wooSettings.woocommerce_store_address_2,
    wooSettings.woocommerce_store_city,
  ].filter(Boolean);

  return {
    ...wpInfo,
    currency: wooSettings.woocommerce_currency,
    contactEmail: wooSettings.woocommerce_email_from_address,
    address: addressParts.length > 0 ? addressParts.join(", ") : undefined,
  };
}

async function updateWooSetting(config: WcConfig, id: string, value: string): Promise<void> {
  if (!config.storeUrl || !config.consumerKey || !config.consumerSecret) return;
  const url = `${baseUrl(config.storeUrl)}/wp-json/wc/v3/settings/general/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${wcCredentials(config)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Woo setting "${id}" update failed: ${res.status} ${body}`);
  }
}

async function updateWordPressSettings(partial: { title?: string; description?: string; admin_email?: string }) {
  const username = process.env.WP_SYNC_USERNAME;
  const appPassword = process.env.WP_SYNC_APP_PASSWORD;
  const wpSiteUrl = process.env.WP_SITE_URL;
  if (!username || !appPassword || !wpSiteUrl) {
    return;
  }

  const auth = Buffer.from(`${username}:${appPassword}`).toString("base64");
  const res = await fetch(`${baseUrl(wpSiteUrl)}/wp-json/wp/v2/settings`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(partial),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WordPress settings update failed: ${res.status} ${body}`);
  }
}

const ADMIN_PASSWORD = process.env.SESSION_SECRET || "admin123";

function requireAuth(req: Request, res: Response): boolean {
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

router.post("/auth/login", (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

router.get("/store-info", (_req: Request, res: Response) => {
  const config = readConfig();
  const s = config.store || {} as StoreSettings;
  res.set("Cache-Control", "public, max-age=300");
  res.json({
    storeName: s.storeName || "Mirruba Jewellery",
    tagline: s.tagline || "An Icon Of Absolute Femininity",
    currency: s.currency || "AED",
    whatsappNumber: s.whatsappNumber || "971501045496",
    contactEmail: s.contactEmail || "contact@mirruba-jewellery.com",
    contactPhone: s.contactPhone || "+971 501 045 496",
    address: s.address || "Sharjah, Emirates, Central Market",
    facebookUrl: s.facebookUrl || "",
    instagramUrl: s.instagramUrl || "",
    developerName: s.developerName || "Mr Apps",
    developerUrl: s.developerUrl || "https://mr-appss.com/",
  });
});

router.get("/settings", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const config = readConfig();
  const remote = await getRemoteStoreInfo(config);
  const s = config.store || {} as StoreSettings;

  const mergedStore = {
    storeName: remote.storeName || s.storeName || "Mirruba Jewellery",
    tagline: remote.tagline || s.tagline || "An Icon Of Absolute Femininity",
    currency: remote.currency || s.currency || "AED",
    whatsappNumber: s.whatsappNumber || "971501045496",
    contactEmail: remote.contactEmail || s.contactEmail || "contact@mirruba-jewellery.com",
    contactPhone: s.contactPhone || "+971 501 045 496",
    address: remote.address || s.address || "Sharjah, Emirates, Central Market",
    facebookUrl: s.facebookUrl || "",
    instagramUrl: s.instagramUrl || "",
    developerName: s.developerName || "Mr Apps",
    developerUrl: s.developerUrl || "https://mr-appss.com/",
  };

  res.json({
    storeUrl: config.storeUrl,
    consumerKey: config.consumerKey ? "••••" + config.consumerKey.slice(-4) : "",
    consumerSecret: config.consumerSecret ? "••••" + config.consumerSecret.slice(-4) : "",
    hasKeys: !!(config.consumerKey && config.consumerSecret),
    store: mergedStore,
  });
});

router.put("/settings", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const { storeUrl, consumerKey, consumerSecret, store } = req.body;
  const current = readConfig();
  const updated: WcConfig = {
    storeUrl: storeUrl || current.storeUrl,
    consumerKey: consumerKey && !consumerKey.startsWith("••••") ? consumerKey : current.consumerKey,
    consumerSecret: consumerSecret && !consumerSecret.startsWith("••••") ? consumerSecret : current.consumerSecret,
    store: store ? { ...(current.store || {}), ...store } : current.store,
  };
  writeConfig(updated);

  const warnings: string[] = [];
  const s = updated.store;

  if (s) {
    try {
      if (s.currency) {
        await updateWooSetting(updated, "woocommerce_currency", s.currency);
      }
      if (s.contactEmail) {
        await updateWooSetting(updated, "woocommerce_email_from_address", s.contactEmail);
      }
      if (s.address) {
        await updateWooSetting(updated, "woocommerce_store_address", s.address);
      }
    } catch (err: unknown) {
      warnings.push(err instanceof Error ? err.message : "Failed to sync WooCommerce settings");
    }

    try {
      await updateWordPressSettings({
        title: s.storeName || undefined,
        description: s.tagline || undefined,
        admin_email: s.contactEmail || undefined,
      });
    } catch (err: unknown) {
      warnings.push(err instanceof Error ? err.message : "Failed to sync WordPress settings");
    }
  }

  res.json({
    success: true,
    message: warnings.length
      ? "Settings saved locally with sync warnings. Check API logs."
      : "Settings updated successfully",
    warnings,
  });
});

router.post("/settings/test", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const config = readConfig();
  try {
    const url = new URL("/wp-json/wc/v3/products", config.storeUrl);
    url.searchParams.set("per_page", "1");
    const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
    const wcRes = await fetch(url.toString(), {
      headers: { Authorization: `Basic ${credentials}` },
    });
    if (wcRes.ok) {
      const data = await wcRes.json();
      res.json({ success: true, message: `Connected! Found ${Array.isArray(data) ? data.length : 0} product(s).` });
    } else {
      res.json({ success: false, message: `Connection failed: HTTP ${wcRes.status}` });
    }
  } catch (err: any) {
    res.json({ success: false, message: `Connection error: ${err.message}` });
  }
});

export default router;
