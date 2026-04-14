import { defineConfig } from "drizzle-kit";

const LOCAL_DB_PATH = String(
  process.env.LOCAL_DB_PATH || "",
);

export default defineConfig({
  schema: "./src/schema/*.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: LOCAL_DB_PATH,
  },
});
