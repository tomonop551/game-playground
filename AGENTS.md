# AGENTS.md

このリポジトリで作業するAIエージェント向けのガイドです。

## プロジェクト概要

さまざまなフロントエンドフレームワーク・ライブラリでWebゲームを開発し、知見を深めるためのリポジトリ。作成したゲームはGitHub Pagesで公開され、ポータルサイト(Astro)からアクセスできます。

- 公開URL: https://tomonop551.github.io/game-playground/
- リポジトリ: https://github.com/tomonop551/game-playground

## ツールチェーン

- Node.js / pnpm のバージョンは **mise**(`mise.toml`)で管理。バージョンを変える場合は `mise.toml` を編集する
- パッケージ管理は **pnpm ワークスペース**(`pnpm-workspace.yaml` に `games/*` と `portal` を登録)

```bash
mise install          # 初回のみ
pnpm install

pnpm build            # 全ゲーム + ポータルを一括ビルド(ルートで実行)
pnpm build:site       # GitHub Pages 用の _site/ を組み立て
pnpm --filter portal dev       # ポータルの開発サーバー
pnpm --filter <ゲーム名> dev    # 特定ゲームの開発サーバー
```

## ディレクトリ構成

```
game-playground/
├── mise.toml                # node / pnpm のバージョン
├── pnpm-workspace.yaml
├── package.json             # ルートスクリプト(build / build:site)
├── scripts/build-site.mjs   # _site 組み立て(ポータル成果物 + ゲーム)
├── portal/                  # ポータルサイト(Astro)
│   ├── astro.config.mjs     # base: "/game-playground"
│   └── src/pages/index.astro
├── games/<ゲーム名>/         # 各ゲーム(独立したフレームワーク/依存関係)
└── .github/workflows/deploy.yml
```

## ルール

### ゲームを追加するとき

1. `games/<ゲーム名>/` にプロジェクトを作成する(ディレクトリ名はケバブケース)
2. `package.json` に `name` と `description`(日本語)を必ず書く。**ポータルの一覧はここから自動生成される**ため、ポータルを編集する必要はない
3. ビルドするゲームは `build` スクリプトを用意し、成果物を `dist/` に出力する。Vite系なら `base: "./"`(相対パス)を設定する
4. `package.json` を持たない静的ゲームは、ディレクトリの中身がそのまま公開される

### GitHub Actions を編集するとき

- **Action は必ずコミットハッシュ(SHA)でピン留めする**(タグやブランチ参照は禁止)。リポジトリ設定で SHA ピン留め必須が有効になっている
- `main` ブランチは保護されている(強制push・削除禁止、管理者にも適用)
- ワークフローにシェルスクリプト(ループ・条件分岐)を書かない。処理はルート `package.json` のスクリプト(`scripts/build-site.mjs` など)に集約する
- ワークフローの実行は `pnpm install --frozen-lockfile` → `pnpm build` → `pnpm build:site` のコマンド呼び出しを基本とする

### 禁止事項

- 生成物(`dist/`、`_site/`、`node_modules/`、`portal/.astro/`)をコミットしない
- シークレットをコードや設定に書き込まない(push protection によりブロックされる)
- `pnpm-lock.yaml` を手動編集しない(`pnpm install` で生成・更新する)

## デプロイの仕組み

`main` へのPushで GitHub Actions が自動実行され、`_site/` が GitHub Pages にデプロイされる。手動実行は `workflow_dispatch` でも可能。

公開前の全体確認はローカルで:

```bash
pnpm build && pnpm build:site
python3 -m http.server -d _site 8080
```
