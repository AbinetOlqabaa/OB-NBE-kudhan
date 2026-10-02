import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3e3;
  const isProd = process.env.NODE_ENV === "production";
  app.use(express.json());
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      service: "OB/NBE Regulatory Reporting Kernel",
      readyForImport: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development"
    });
  });
  if (isProd) {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true",
        watch: process.env.DISABLE_HMR === "true" ? null : {}
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kernel server running at http://0.0.0.0:${PORT} [${isProd ? "production" : "development"}]`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
