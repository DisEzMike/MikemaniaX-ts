#!/bin/sh

echo "🔍 Checking for node_modules..."

if [ ! -d node_modules ]; then
  echo "📦 node_modules not found. Installing..."
  npm install
else
  echo "✅ node_modules already exists."
fi

exec "$@"