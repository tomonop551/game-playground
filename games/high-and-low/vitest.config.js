import { defineConfig } from "vitest/config";

// vite.config.js の sveltekit プラグインはテストに不要なので vitest 側は別設定とする
export default defineConfig({
  test: {
    include: ["src/**/*.test.js"],
  },
});
