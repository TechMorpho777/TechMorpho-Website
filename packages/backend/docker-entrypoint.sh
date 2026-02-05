#!/bin/sh
set -e

echo "🚀 Starting TechMorpho Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
  echo "   Database not ready, waiting 2 seconds..."
  sleep 2
done
echo "✅ Database is ready!"

# Run migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migration failed, trying to initialize..."
  npx prisma migrate dev --name init --create-only || true
  npx prisma migrate deploy || true
}

# Check if admin user exists, create if not
echo "👤 Checking admin user..."
ADMIN_EXISTS=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Admin\";" 2>/dev/null | grep -o '[0-9]' | head -1 || echo "0")

if [ "$ADMIN_EXISTS" = "0" ] || [ -z "$ADMIN_EXISTS" ]; then
  echo "📝 Creating default admin user..."
  npm run setup-admin || echo "⚠️  Admin creation skipped (may already exist)"
else
  echo "✅ Admin user already exists"
fi

# Start the server
echo "🎯 Starting server..."
exec npm start

