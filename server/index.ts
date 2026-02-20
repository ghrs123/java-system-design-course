import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
  const app = express();
  const server = createServer(app);

  const staticPath = isProduction
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Serve course content (markdown etc.) from level-* folders
  const repoRoot = path.resolve(__dirname, "..");
  app.use("/course-content", (req, res, next) => {
    if (req.method !== "GET" || !req.url) return next();
    const urlPath = req.url.replace(/^\//, "").split("?")[0];
    const filePath = path.join(repoRoot, urlPath);
    const normalized = path.normalize(filePath);
    if (!normalized.startsWith(repoRoot)) return next();
    fs.stat(normalized, (err, stat) => {
      if (err || !stat.isFile()) return next();
      const ext = path.extname(normalized).toLowerCase();
      if (ext === ".md") res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      else if (ext === ".html") res.setHeader("Content-Type", "text/html; charset=utf-8");
      else res.setHeader("Content-Type", "application/octet-stream");
      fs.createReadStream(normalized).pipe(res);
    });
  });

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
