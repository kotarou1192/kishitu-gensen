# 開発環境用 Dockerfile
FROM node:20-alpine

WORKDIR /app

# 依存関係のキャッシュ最適化のため、package*.json を先にコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# Vite の開発サーバーのポートを公開
EXPOSE 5173

# 開発サーバーを起動（ホストからアクセスできるようにする）
CMD ["npm", "run", "dev", "--", "--host"]
