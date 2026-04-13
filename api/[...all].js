export default async function handler(req, res) {
  const mod = await import("../artifacts/api-server/dist/vercel-handler.mjs");
  return mod.default(req, res);
}
