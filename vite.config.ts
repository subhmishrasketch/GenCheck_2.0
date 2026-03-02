import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["robots.txt"],
      manifest: {
        name: "GenCheck - AI Detector for AI-Generated PowerPoints",
        short_name: "GenCheck",
        description:
          "Upload any PowerPoint or PDF file and let our advanced AI analysis determine if it was created by AI tools or crafted by humans.",
        theme_color: "#ffffff",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        icons: [
          {
            src: "https://storage.googleapis.com/gpt-engineer-file-uploads/ymgKWmsFJDUH6va1WDeS36TkIov2/uploads/1765260520647-FullLogo_Transparent.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "https://storage.googleapis.com/gpt-engineer-file-uploads/ymgKWmsFJDUH6va1WDeS36TkIov2/uploads/1765260520647-FullLogo_Transparent.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
