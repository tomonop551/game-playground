# Game Playground 🎮

さまざまなフロントエンドフレームワーク・ライブラリを使用してWebゲームを開発し、技術的な知見を深めるためのリポジトリ。

作成したゲームはGitHub Pagesで公開され、[ポータルサイト](https://tomonop551.github.io/game-playground/)からアクセスできます。

## 構成

```
game-playground/
├── package.json             # ルートスクリプト(pnpm ワークスペース)
├── pnpm-workspace.yaml      # games/* と portal をワークスペースとして登録
├── mise.toml                # node / pnpm のバージョン管理
├── scripts/
│   └── build-site.mjs       # GitHub Pages 用の _site 組み立てスクリプト
├── portal/                  # ポータルサイト(Astro)
│   ├── astro.config.mjs
│   └── src/pages/index.astro   # games/* からゲーム一覧を自動生成
├── games/
│   └── tic-tac-toe/         # ゲームごとに独立したディレクトリ
│       ├── package.json     # name / description がポータルのリスト表示に使われる
│       ├── vite.config.js
│       └── src/
└── .github/workflows/
    └── deploy.yml           # GitHub Pages デプロイワークフロー
```

各ゲームは `games/<ゲーム名>/` 単位で独立しており、フレームワーク(Vanilla JS / React / Vue / Svelte / Phaser など)を自由に選択できます。

Node.js / pnpm のバージョンは [mise](https://mise.jdx.dev/) で管理しています(`mise.toml` 参照)。

## 公開の仕組み

- `main` ブランチにPushすると、GitHub Actionsが自動でビルド & デプロイします
- `pnpm build`(ワークスペース再帰)でポータル(Astro)と各ゲーム(Vite)を一括ビルド
- `pnpm build:site` でポータルの成果物とゲームを `_site/` に組み立て
  - `package.json` を持つゲームは `dist/` の成果物を配置
  - 持たないゲーム(静的HTMLなど)はディレクトリの中身をそのまま配置
- ポータルのゲーム一覧は `games/*/package.json` の `name` / `description` から**自動生成**されます
- GitHub ActionsはSHAでピン留めしたバージョンを使用しています

## 新しいゲームを追加する

1. `games/<ゲーム名>/` に新しいプロジェクトを作成する
   ```bash
   pnpm create vite games/my-game --template react
   ```
2. `games/my-game/package.json` に `description` を書く(ポータルのリストに表示されます)
3. Vite系プロジェクトなら `vite.config.ts` で `base: "./"`(相対パス)を指定する
4. Pushすれば、ポータルの一覧追加と公開は自動的に行われます

## ローカル開発

[mise](https://mise.jdx.dev/) と [pnpm](https://pnpm.io/) がインストールされていれば、`mise.toml` に基づくNode.jsバージョンが自動で使われます。

```bash
mise install    # mise.toml で指定したツールをインストール(初回のみ)
pnpm install

pnpm build                     # 全ゲーム + ポータルを一括ビルド
pnpm build:site                # GitHub Pages 用の _site を組み立て
pnpm --filter portal dev       # ポータルを開発モードで起動
pnpm --filter tic-tac-toe dev  # 特定のゲームを開発モードで起動
```

ポータルを含む全体を確認するには、`pnpm build:site` 後に任意の静的サーバーで `_site/` を起動します(例: `python3 -m http.server -d _site 8080`)。

CI(GitHub Actions)でも [jdx/mise-action](https://github.com/jdx/mise-action) 経由で同じ `mise.toml` を使用するため、ローカルとCIでバージョンが揃います。

## ライセンス

MIT
