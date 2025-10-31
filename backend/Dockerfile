FROM oven/bun:1.1 as builder

WORKDIR /usr/app/src
COPY package.json bun.lock* ./
RUN bun install

COPY . .
RUN bunx prisma generate

RUN bun run build

FROM node:18-alpine
WORKDIR /src/app/src
COPY --from=builder /usr/app/src/package.json ./
COPY --from=builder /usr/app/src/node_modules ./node_modules

COPY --from=builder /usr/app/src/prisma ./prisma
COPY --from=builder /usr/app/src/dist ./dist
COPY --from=builder /usr/app/src/entrypoint.sh .

RUN chmod +x ./entrypoint.sh
EXPOSE 8000

CMD [ "./entrypoint.sh" ]


