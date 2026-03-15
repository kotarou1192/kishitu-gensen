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

# OGP画像を生成
make generate-ogp
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

# OGP画像を生成
npm run ogp:generate

# 武器を追加/更新（WEAPONS + i18n を同時更新）
npm run weapons:add -- \
   --ja "テルミット・カッター" \
   --en "Thermite Cutter" \
   --rarity 6 \
   --category "片手剣" \
   --base "意志UP" \
   --additional "攻撃力UP" \
   --skill "流回"

# 武器データとi18nの整合性チェック
npm run weapons:check
```

`npm run weapons:add` は次の2ファイルを自動で更新します。

- `src/lib/constants/weapons.ts` の `WEAPONS`
- `src/lib/i18n/index.ts` の `weaponI18nMap`

挙動は以下です。

- JA名が未登録: 新規追加
- JA名が既存: 同名エントリを更新

必要に応じて以下も利用できます。

```bash
# 変更内容だけ確認（ファイルは更新しない）
node scripts/add-weapon-i18n.js \
   --ja "テルミット・カッター" \
   --en "Thermite Cutter" \
   --rarity 6 \
   --category "片手剣" \
   --base "意志UP" \
   --additional "攻撃力UP" \
   --skill "流回" \
   --dry-run
```

`npm run weapons:check` は新しい武器を追加したときに、以下を検証します。

- `src/lib/constants/weapons.ts` にある武器名と `src/lib/i18n/index.ts` の `weaponI18nMap` の同期
- JAキー重複、EN名重複（デフォルトでエラー）
- マッピング漏れがある場合は貼り付け用のテンプレート行を出力

必要に応じて以下も利用できます。

```bash
# EN重複を警告扱いにする
node scripts/check-weapons-maintenance.js --allow-duplicate-en

# CI連携向けにJSONで結果を出力
node scripts/check-weapons-maintenance.js --json
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

### CI/CD

- **テスト**: プッシュ・プルリクエスト時に自動実行
- **デプロイ**: main ブランチへのプッシュで自動デプロイ
- **Dependabot**: 毎週月曜日 9:00 (JST) に依存関係を自動チェック

## 🛠 技術スタック

- Vue.js 3
- TypeScript
- Vite
- Vitest (テスト)
- Docker & Docker Compose
- GitHub Pages
- GitHub Actions (CI/CD)

## 📄 ライセンス

MIT

## 🎯 機能

- ✅ 基質厳選パターンの自動計算
- ✅ エリア別の固定枠パターン表示
- ✅ 入手可能な武器のレアリティ別表示
- ✅ レスポンシブデザイン
- ✅ ダークモード対応
