#!/bin/sh
set -e

echo "menjalankan seeder database"
bunx prisma db push --schema=./prisma/schema.prisma

echo "menjalankan seeder"
bun run seeder

echo "starting running aplikasi"
exec bun dist/main.js