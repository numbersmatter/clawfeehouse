import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
   server: {
    host: "localhost",
    port: 5180,
    strictPort: true,
  },
  plugins: [
    cloudflare({ 
      viteEnvironment: { name: "ssr" },
      inspectorPort: 9335, 
    }),
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
