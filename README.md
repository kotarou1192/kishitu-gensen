# 基質厳選ツール

アークナイツ：エンドフィールドの基質（武器）厳選を補助するWebツールです。

## 🎮 概要

このツールは、アークナイツ：エンドフィールドにおいて、特定の基質（武器）を厳選する際に、どのエリアでどのような固定枠設定をすれば目的の武器が入手できるかを計算します。

## 🌐 使い方

1. **欲しい武器の効果を選択**
   - 基礎（知性UP、筋力UPなど）
   - 付加（攻撃力UP、HPアップなど）
   - スキル（夜幕、強攻など）

2. **計算ボタンをクリック**
   - 各エリアで可能な固定枠パターンが表示されます
   - そのパターンで入手可能な武器がレアリティ別に表示されます

## 🚀 開発

### 必要な環境

- Node.js 18以上
- または Docker と Docker Compose

### ローカルで実行

#### Makefile を使う方法（推奨）

```bash
# 使用可能なコマンドを表示
make help

# 依存関係をインストール
make install

# 開発サーバーを起動
make dev

# テストを実行
make test

# ビルド
make build
```

#### Docker Compose で開発

```bash
# Dockerコンテナを起動
make docker-up

# バックグラウンドで起動
make docker-up-d

# コンテナを停止
make docker-down

# コンテナ内でテストを実行
make docker-test
```

#### 通常の方法

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# テストを実行
npm test

# ビルド
npm run build

# プレビュー
npm run preview
```

#### Docker Compose を使う方法

```bash
# コンテナをビルド・起動
docker compose up

# バックグラウンドで起動
docker compose up -d

# コンテナを停止
docker compose down

# コンテナ内でコマンドを実行（例：テスト）
docker compose exec app npm test -- --run
```

開発サーバーは http://localhost:5173 でアクセスできます。
ソースコードの変更は自動的に反映されます（ホットリロード）。

## 📦 デプロイ

このプロジェクトはGitHub Pagesにデプロイされています。`main`ブランチへのプッシュで自動的にデプロイされます。

### 初回デプロイ設定

1. リポジトリの Settings > Pages に移動
2. Source を「GitHub Actions」に設定
3. `main`ブランチにプッシュすると自動的にデプロイされます

## 🛠 技術スタック

- Vue.js 3
- TypeScript
- Vite
- GitHub Pages
- GitHub Actions

## 📄 ライセンス

MIT

## 🎯 機能

- ✅ 基質厳選パターンの自動計算
- ✅ エリア別の固定枠パターン表示
- ✅ 入手可能な武器のレアリティ別表示
- ✅ レスポンシブデザイン
- ✅ ダークモード対応
