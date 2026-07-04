import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Map the "@/..." path alias (from tsconfig) to the project root so unit
// tests can import app modules the same way the app does.
const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: { "@": root.replace(/\/$/, "") },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
