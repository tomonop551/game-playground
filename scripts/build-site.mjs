import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const site = join(root, "_site");

await rm(site, { recursive: true, force: true });
await mkdir(site, { recursive: true });

// ポータル(Astro)のビルド成果物をルートに配置
const portalDist = join(root, "portal", "dist");
if (existsSync(portalDist)) {
  await cp(portalDist, site, { recursive: true });
} else {
  console.warn("portal/dist が存在しません。先に `pnpm build` を実行してください。");
}

// ゲーム(pnpmワークスペースでビルドされた dist、または静的ゲームのディレクトリ)
for (const entry of await readdir(join(root, "games"), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = join(root, "games", entry.name);
  const dist = join(dir, "dist");
  const dest = join(site, "games", entry.name);
  if (existsSync(dist)) {
    await cp(dist, dest, { recursive: true });
  } else {
    // package.json を持たない静的ゲームはディレクトリをそのままコピー
    await cp(dir, dest, {
      recursive: true,
      filter: (src) => !src.includes("node_modules"),
    });
  }
}

console.log(`Site assembled at ${site}`);
