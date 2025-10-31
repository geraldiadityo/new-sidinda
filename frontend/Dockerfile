FROM oven/bun:1.1 AS builder
WORKDIR /app

ENV NODE_ENV=production
COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile
COPY . .

RUN bun run build

FROM node:18-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./

COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

# Jalankan server.js dengan 'node', BUKAN 'bun'
CMD ["node", "server.js"]