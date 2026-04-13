import { Router, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const CONFIG_PATH = path.join(process.cwd(), ".wc-config.json");

interface WcConfig {
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

function readConfig(): WcConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}
  return {
    storeUrl: process.env.WC_STORE_URL || "https://admin.mirruba-jewellery.com",
    consumerKey: process.env.WC_CONSUMER_KEY || "",
    consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  };
}

function writeConfig(config: WcConfig): void {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

export function getActiveConfig(): WcConfig {
  return readConfig();
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

router.get("/settings", (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const config = readConfig();
  res.json({
    storeUrl: config.storeUrl,
    consumerKey: config.consumerKey ? "••••" + config.consumerKey.slice(-4) : "",
    consumerSecret: config.consumerSecret ? "••••" + config.consumerSecret.slice(-4) : "",
    hasKeys: !!(config.consumerKey && config.consumerSecret),
  });
});

router.put("/settings", (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const { storeUrl, consumerKey, consumerSecret } = req.body;
  const current = readConfig();
  const updated: WcConfig = {
    storeUrl: storeUrl || current.storeUrl,
    consumerKey: consumerKey && !consumerKey.startsWith("••••") ? consumerKey : current.consumerKey,
    consumerSecret: consumerSecret && !consumerSecret.startsWith("••••") ? consumerSecret : current.consumerSecret,
  };
  writeConfig(updated);
  res.json({ success: true, message: "Settings updated successfully" });
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
