FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
RUN npm install

COPY apps/web ./apps/web
RUN cd apps/web && npx vite build

# Final stage
FROM alpine:latest

RUN apk add --no-cache wget unzip ca-certificates

WORKDIR /app

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip \
    && unzip pocketbase_0.22.0_linux_amd64.zip \
    && rm pocketbase_0.22.0_linux_amd64.zip \
    && chmod +x pocketbase

# ✅ Correct paths
COPY apps/pocketbase/pb_migrations ./pb_migrations
COPY apps/pocketbase/pb_hooks ./pb_hooks

COPY --from=builder /app/apps/web/dist ./pb_public

EXPOSE 8090

CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
