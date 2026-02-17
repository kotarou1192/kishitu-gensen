.PHONY: help install dev build preview test test-ui clean docker-up docker-down docker-build docker-test docker-logs

# デフォルトターゲット: ヘルプを表示
help:
	@echo "使用可能なコマンド:"
	@echo "  make install       - 依存関係をインストール"
	@echo "  make dev           - 開発サーバーを起動"
	@echo "  make build         - プロダクションビルドを実行"
	@echo "  make preview       - ビルド結果をプレビュー"
	@echo "  make test          - テストを実行"
	@echo "  make test-ui       - テストUIを起動"
	@echo "  make clean         - ビルド成果物を削除"
	@echo ""
	@echo "Docker関連:"
	@echo "  make docker-up     - Dockerコンテナを起動"
	@echo "  make docker-down   - Dockerコンテナを停止"
	@echo "  make docker-build  - Dockerイメージを再ビルド"
	@echo "  make docker-test   - Dockerコンテナ内でテストを実行"
	@echo "  make docker-logs   - Dockerコンテナのログを表示"

# 依存関係をインストール
install:
	npm install

# 開発サーバーを起動
dev:
	npm run dev

# プロダクションビルド
build:
	npm run build

# プレビューサーバーを起動
preview:
	npm run preview

# テストを実行
test:
	npm test -- --run

# テストUIを起動
test-ui:
	npm run test:ui

# ビルド成果物を削除
clean:
	rm -rf dist node_modules

# Dockerコンテナを起動（フォアグラウンド）
docker-up:
	docker compose up

# Dockerコンテナをバックグラウンドで起動
docker-up-d:
	docker compose up -d

# Dockerコンテナを停止
docker-down:
	docker compose down

# Dockerイメージを再ビルドして起動
docker-build:
	docker compose up --build

# Dockerコンテナ内でテストを実行
docker-test:
	docker compose exec app npm test -- --run

# Dockerコンテナのログを表示
docker-logs:
	docker compose logs -f
