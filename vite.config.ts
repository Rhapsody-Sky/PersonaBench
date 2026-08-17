import { defineConfig } from "vite";
import { cpSync } from "node:fs";

export default defineConfig({
  // Persona Bench is served from the root of personabench.rhapsody.me.
  // Root-relative paths keep assets working reliably on a normal web host.
  base: "/",
  plugins: [
    {
      name: "copy-persona-bench-skills",
      closeBundle() {
        cpSync("Skills", "dist/Skills", { recursive: true });
      },
    },
  ],
});
