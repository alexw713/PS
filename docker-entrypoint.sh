#!/bin/sh
set -e
echo "Waiting for database..."
npx prisma db push --skip-generate
npx tsx prisma/seed.ts
echo "Starting app..."
exec node server.js
