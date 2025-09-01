#!/bin/bash

# Railway deployment script for Wasp application
set -e

echo "🚀 Starting Railway deployment preparation..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "Install it from: https://railway.app/cli"
    exit 1
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "❌ You are not logged in to Railway."
    echo "Run: railway login"
    exit 1
fi

echo "✅ Railway CLI is ready"

# Validate Wasp configuration
echo "🔍 Validating Wasp configuration..."
if [ ! -f "main.wasp" ]; then
    echo "❌ main.wasp file not found. Are you in the correct directory?"
    exit 1
fi

echo "✅ Wasp configuration found"

# Test local Docker build (optional but recommended)
read -p "🐳 Test Docker build locally first? (y/n): " test_build
if [[ $test_build == "y" || $test_build == "Y" ]]; then
    echo "🔨 Testing Docker build locally..."
    docker build -t wasp-app-test . --no-cache
    echo "✅ Local Docker build successful"
    
    # Clean up test image
    docker rmi wasp-app-test 2>/dev/null || true
fi

# Deploy to Railway
echo "🚂 Deploying to Railway..."
railway up --detach

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Check deployment status: railway status"
echo "2. View logs: railway logs"
echo "3. Set environment variables if not already configured:"
echo ""
echo "🔑 Required environment variables:"
echo "   railway variables set DATABASE_URL=<your-postgres-url>"
echo "   railway variables set JWT_SECRET=<your-jwt-secret>"
echo "   railway variables set WASP_WEB_CLIENT_URL=<your-frontend-url>"
echo "   railway variables set WASP_SERVER_URL=<your-backend-url>"
echo ""
echo "💡 Pro tips:"
echo "   - Monitor deployment: railway status"
echo "   - View app logs: railway logs --follow"
echo "   - Connect domain: railway domain"
echo "   - Generate DATABASE_URL: railway add --database postgresql"
echo ""
echo "🌐 Your app will be available at: $(railway domain 2>/dev/null || echo '<generate-domain-with-railway-domain>')"