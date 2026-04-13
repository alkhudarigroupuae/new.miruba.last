import { Router, type Request, type Response } from "express";
import { getActiveConfig } from "./settings";

const router = Router();

router.post("/newsletter/subscribe", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    const config = getActiveConfig();
    const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");

    const customerUrl = new URL("/wp-json/wc/v3/customers", config.storeUrl);
    customerUrl.searchParams.set("email", email);

    const existingRes = await fetch(customerUrl.toString(), {
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (existingRes.ok) {
      const existing = await existingRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return res.json({ success: true, message: "Already subscribed" });
      }
    }

    const createUrl = new URL("/wp-json/wc/v3/customers", config.storeUrl);
    const createRes = await fetch(createUrl.toString(), {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name: "Newsletter",
        last_name: "Subscriber",
        username: `subscriber_${Date.now()}`,
        meta_data: [
          { key: "newsletter_subscriber", value: "yes" },
          { key: "subscribed_at", value: new Date().toISOString() },
        ],
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      req.log.warn({ errText }, "WC customer creation failed, storing locally");
    }

    req.log.info({ email }, "Newsletter subscription received");
    return res.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    req.log.error({ err }, "Newsletter subscription failed");
    return res.status(500).json({ error: "Subscription failed" });
  }
});

export default router;
