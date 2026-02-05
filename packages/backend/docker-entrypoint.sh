#!/bin/sh
set -e

echo "🚀 Starting TechMorpho Backend..."

# Wait for database to be ready (simple connection test)
echo "⏳ Waiting for database to be ready..."
RETRIES=30
until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "   Database not ready, waiting 2 seconds... ($RETRIES retries left)"
  RETRIES=$((RETRIES-1))
  sleep 2
done

if [ $RETRIES -eq 0 ]; then
  echo "❌ Database connection failed after 60 seconds"
  exit 1
fi

echo "✅ Database is ready!"

# Run migrations
echo "📦 Running database migrations..."
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  echo "   Found migrations, deploying..."
  npx prisma migrate deploy || {
    echo "⚠️  Migration deploy failed, trying db push as fallback..."
    npx prisma db push --accept-data-loss || echo "⚠️  Database setup failed"
  }
else
  echo "   No migrations found, using db push for initial setup..."
  npx prisma db push --accept-data-loss || echo "⚠️  Database setup failed"
fi

# Try to create admin user (will skip if already exists)
echo "👤 Setting up admin user..."
npm run setup-admin || echo "⚠️  Admin setup skipped (may already exist or database not ready)"

# Start the server
echo "🎯 Starting server..."
exec npm start

