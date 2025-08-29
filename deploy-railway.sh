#!/bin/bash

echo "🚀 Preparando deployment para Railway..."

# Build Wasp localmente
echo "📦 Building Wasp project..."
wasp build

# Crear package.json para el servidor si no existe
if [ ! -f ".wasp/build/server/package.json" ]; then
    echo "❌ Error: Build failed or server directory not found"
    exit 1
fi

# Añadir script de start si no existe
cd .wasp/build/server
if ! grep -q '"start"' package.json; then
    echo "📝 Adding start script to server package.json..."
    npm pkg set scripts.start="node app.js"
fi

# Commitear el build (temporalmente)
cd ../../..
echo "📤 Preparing build for deployment..."
git add -f .wasp/build/
git commit -m "Add production build for Railway deployment (temporary)"

echo "🎯 Ready to push! Run: git push"
echo ""
echo "⚠️  IMPORTANTE en Railway:"
echo "1. Cambia Root Directory a: .wasp/build/server"
echo "2. Build Command: npm ci && npx prisma generate"
echo "3. Start Command: npm start"
echo ""
echo "Para el frontend, crea otro servicio con:"
echo "- Root Directory: .wasp/build/web-app"
echo "- Build Command: npm ci && npm run build"
echo "- Start Command: npm start"