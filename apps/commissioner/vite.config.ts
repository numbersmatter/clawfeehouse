import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: "localhost",
    port: 5177,
    strictPort: true,
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      inspectorPort: 9332,
      persistState: {
        path: "../../packages/db_drizzle/data/wrangler-state",
      },
    }),
    tailwindcss(),
    reactRouter(),
    // tsconfigPaths(),
  ],
  resolve:{
    tsconfigPaths: true,
  }
});
