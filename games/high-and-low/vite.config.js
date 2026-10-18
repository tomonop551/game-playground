import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit({
      // build-site.mjs が参照するのは dist/ のため
      adapter: adapter({ pages: "dist", assets: "dist" }),
    }),
  ],
});
