import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "url";

import { resolve } from "path";

// Convert file URL to path for ES module compatibility
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Example of setting an alias
      "@": resolve(__dirname, "./src"),
    },
  },
});
