#!/bin/sh
set -e

echo "menjalankan seeder database"
npx prisma db push --schema=./prisma/schema.prisma

echo "menjalankan seeder"
npm run seeder:dev

echo "starting running aplikasi"
exec node dist/src/main