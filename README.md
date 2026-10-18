# Game Playground 🎮

さまざまなフロントエンドフレームワーク・ライブラリを使用してWebゲームを開発し、技術的な知見を深めるためのリポジトリ。

作成したゲームはGitHub Pagesで公開され、[ポータルサイト](https://tomonop551.github.io/game-playground/)からアクセスできます。

## 構成

```
game-playground/
├── index.html               # ポータルサイト(ゲーム一覧)
├── package.json             # ルートスクリプト(pnpm ワークスペース)
├── pnpm-workspace.yaml      # games/* をワークスペースとして登録
├── mise.toml                # node / pnpm のバージョン管理
├── scripts/
│   └── build-site.mjs       # GitHub Pages 用の _site 組み立てスクリプト
├── games/
│   └── tic-tac-toe/         # ゲームごとに独立したディレクトリ
│       ├── package.json
│       ├── vite.config.js
│       └── src/
└── .github/workflows/
    └── deploy.yml           # GitHub Pages デプロイワークフロー
```

各ゲームは `games/<ゲーム名>/` 単位で独立しており、フレームワーク(Vanilla JS / React / Vue / Svelte / Phaser など)を自由に選択できます。

Node.js のバージョンは [mise](https://mise.jdx.dev/) で管理しています(`mise.toml` 参照)。

## 公開の仕組み

- `main` ブランチにPushすると、GitHub Actionsが自動でビルド & デプロイします
- `pnpm build`(ワークスペース再帰)で各ゲームの `dist/` を生成
- `pnpm build:site` でポータルとビルド成果物を `_site/` に組み立て
  - `package.json` を持つゲームは `dist/` の成果物を配置
  - 持たないゲーム(静的HTMLなど)はディレクトリの中身をそのまま配置
- GitHub ActionsはSHAでピン留めしたバージョンを使用しています

## 新しいゲームを追加する

1. `games/<ゲーム名>/` に新しいプロジェクトを作成する
   ```bash
   pnpm create vite games/my-game --template react
   ```
2. Vite系プロジェクトなら `vite.config.ts` で `base: "./"`(相対パス)を指定する
3. ポータルサイト `index.html` にゲームへのカード(リンク)を追加する
4. Pushすれば自動的に公開されます

## ローカル開発

[mise](https://mise.jdx.dev/) と [pnpm](https://pnpm.io/) がインストールされていれば、`mise.toml` に基づくNode.jsバージョンが自動で使われます。

```bash
mise install    # mise.toml で指定したツールをインストール(初回のみ)
pnpm install

pnpm build               # 全ゲームを一括ビルド
pnpm --filter tic-tac-toe dev   # 特定のゲームを開発モードで起動
```

CI(GitHub Actions)でも [jdx/mise-action](https://github.com/jdx/mise-action) 経由で同じ `mise.toml` を使用するため、ローカルとCIでバージョンが揃います。

## ライセンス

MIT
