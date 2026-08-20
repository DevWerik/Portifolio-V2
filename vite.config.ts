import { fileURLToPath, URL } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const DEFAULT_SITE_URL = "https://wasportifolio.vercel.app/";

function resolveSiteUrl(value: string | undefined) {
  const rawUrl = value?.trim() || DEFAULT_SITE_URL;
  const siteUrl = new URL(rawUrl);

  if (siteUrl.protocol !== "https:") {
    throw new Error("VITE_SITE_URL must use HTTPS.");
  }

  if (
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.search ||
    siteUrl.hash
  ) {
    throw new Error(
      "VITE_SITE_URL cannot contain credentials, a query string, or a hash.",
    );
  }

  siteUrl.pathname = normalizeBasePath(siteUrl.pathname);

  return siteUrl;
}

function normalizeBasePath(value: string) {
  const path = value.trim();

  if (!path || path === "/") return "/";

  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

function seoPlugin(siteUrl: URL): Plugin {
  const canonicalUrl = siteUrl.href;
  const socialImageUrl = new URL("og-image.png", siteUrl).href;
  const profileImageUrl = new URL("WS.png", siteUrl).href;
  const sitemapUrl = new URL("sitemap.xml", siteUrl).href;
  const replacements = {
    __SITE_URL__: canonicalUrl,
    __PERSON_ID__: `${canonicalUrl}#person`,
    __OG_IMAGE_URL__: socialImageUrl,
    __PROFILE_IMAGE_URL__: profileImageUrl,
  } as const;
  const robots = `User-agent: *\nDisallow:\n\nSitemap: ${sitemapUrl}\n`;
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "  <url>",
    `    <loc>${canonicalUrl}</loc>`,
    "  </url>",
    "</urlset>",
    "",
  ].join("\n");
  let outputDirectory = "";

  return {
    name: "portfolio-seo",
    transformIndexHtml(html) {
      return Object.entries(replacements).reduce(
        (result, [token, content]) => result.replaceAll(token, content),
        html,
      );
    },
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await mkdir(outputDirectory, { recursive: true });
      await Promise.all([
        writeFile(resolve(outputDirectory, "robots.txt"), robots, "utf8"),
        writeFile(resolve(outputDirectory, "sitemap.xml"), sitemap, "utf8"),
      ]);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = resolveSiteUrl(env.VITE_SITE_URL);

  return {
    base: siteUrl.pathname,
    plugins: [react(), tailwindcss(), seoPlugin(siteUrl)],
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "react-vendor",
                test: /[\\/]node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
                priority: 30,
              },
              {
                name: "animation-vendor",
                test: /[\\/]node_modules[\\/]gsap[\\/]/,
                priority: 20,
              },
              {
                name: "form-vendor",
                test: /[\\/]node_modules[\\/](?:@hookform|react-hook-form|zod)[\\/]/,
                priority: 20,
              },
              {
                name: "ui-vendor",
                test: /[\\/]node_modules[\\/](?:@base-ui|lucide-react|react-icons)[\\/]/,
                priority: 10,
              },
            ],
          },
        },
      },
    },
    server: {
      watch: {
        // Avoid transient EBUSY errors from Windows' native file watcher.
        usePolling: process.platform === "win32",
        interval: 250,
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
