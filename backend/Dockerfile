FROM oven/bun:1.1 as builder

WORKDIR /usr/src/app
COPY package.json bun.lock* ./
RUN bun install

COPY . .
RUN bunx prisma generate

RUN bun build ./src/main.ts ./prisma/seeder.ts --outdir ./dist --target=bun

FROM oven/bun:1-slim

WORKDIR /usr/src/app
COPY package.json bun.lock* ./
RUN bun install --production
ENV PRISMA_CLI_BINARY_TARGETS="native,debian-openssl-3.0.x"
# Salin hasil build
COPY --from=builder /usr/src/app/dist ./dist

# Salin Prisma schema dan client yang sudah di-generate
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Salin dan beri izin entrypoint
COPY --from=builder /usr/src/app/entrypoint.sh .
RUN chmod +x ./entrypoint.sh

CMD [ "./entrypoint.sh" ]


