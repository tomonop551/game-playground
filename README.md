# Game Playground 🎮

さまざまなフロントエンドフレームワーク・ライブラリを使用してWebゲームを開発し、技術的な知見を深めるためのリポジトリ。

作成したゲームはGitHub Pagesで公開され、[ポータルサイト](https://tomonop551.github.io/game-playground/)からアクセスできます。

## 構成

```
game-playground/
├── index.html               # ポータルサイト(ゲーム一覧)
├── games/
│   └── tic-tac-toe/         # ゲームごとに独立したディレクトリ
│       ├── package.json
│       ├── index.html
│       └── src/
└── .github/workflows/
    └── deploy.yml           # GitHub Pages デプロイワークフロー
```

各ゲームは `games/<ゲーム名>/` 単位で独立しており、フレームワーク(Vanilla JS / React / Vue / Svelte / Phaser など)を自由に選択できます。

## 公開の仕組み

- `main` ブランチにPushすると、GitHub Actionsが自動でビルド & デプロイします
- `package.json` を持つゲームは `npm run build` の成果物(`dist/`)をデプロイ
- 持たないゲーム(静的HTMLなど)はディレクトリの中身をそのままデプロイ
- ポータルサイト(`index.html`)はルートに配置されます

## 新しいゲームを追加する

1. `games/<ゲーム名>/` に新しいプロジェクトを作成する
   ```bash
   npm create vite@latest games/my-game -- --template react
   ```
2. ビルドする場合は `package.json` に `build` スクリプトを用意する
   - Vite系なら `vite.config.ts` で `base: "./"`(相対パス)を指定するか、CI側で `--base=./` が渡されます
3. ポータルサイト `index.html` にゲームへのカード(リンク)を追加する
4. Pushすれば自動的に公開されます

## ローカル開発

```bash
cd games/tic-tac-toe
npm install
npm run dev
```

## ライセンス

MIT
