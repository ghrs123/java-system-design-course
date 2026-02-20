import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import type { Plugin, ViteDevServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = __dirname;

/**
 * Serves course content (level-* folders) at /course-content in dev.
 */
function vitePluginCourseContent(): Plugin {
  return {
    name: "course-content",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/course-content", (req, res, next) => {
        if (req.method !== "GET" || !req.url) return next();
        const urlPath = req.url.replace(/^\//, "").split("?")[0];
        const filePath = path.join(PROJECT_ROOT, urlPath);
        if (!filePath.startsWith(PROJECT_ROOT)) return next();
        fs.stat(filePath, (err, stat) => {
          if (err || !stat.isFile()) return next();
          const ext = path.extname(filePath).toLowerCase();
          if (ext === ".md") res.setHeader("Content-Type", "text/markdown; charset=utf-8");
          else if (ext === ".html") res.setHeader("Content-Type", "text/html; charset=utf-8");
          else res.setHeader("Content-Type", "application/octet-stream");
          fs.createReadStream(filePath).pipe(res);
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vitePluginCourseContent()],
  resolve: {
    alias: {
      "@": path.resolve(PROJECT_ROOT, "client", "src"),
      "@shared": path.resolve(PROJECT_ROOT, "shared"),
    },
  },
  root: path.resolve(PROJECT_ROOT, "client"),
  build: {
    outDir: path.resolve(PROJECT_ROOT, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
});
