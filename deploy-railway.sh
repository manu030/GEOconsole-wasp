#!/bin/bash

# Railway deployment script for Wasp application
set -e

echo "🚀 Starting Railway deployment preparation..."

# Build the Wasp application
echo "📦 Building Wasp application..."
wasp build

# Navigate to server build directory
cd .wasp/build/server

# Create railway.json configuration
echo "⚙️ Creating Railway configuration..."
cat > railway.json << EOF
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "npm run start-production",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
EOF

# Create a production-ready Dockerfile
echo "🐳 Creating production Dockerfile..."
cat > Dockerfile << 'EOF'
FROM node:22-slim

WORKDIR /app

# Install OpenSSL and other dependencies
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY rollup.config.js ./

# Install ALL dependencies (including dev for build)
RUN npm ci

# Copy source files
COPY src ./src
COPY .env* ./

# Copy Prisma files
COPY ../db ../db

# Generate Prisma client
RUN npx prisma generate --schema=../db/schema.prisma

# Build the application
RUN npm run bundle

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3000

# Production start command
CMD ["npm", "run", "start-production"]
EOF

echo "✅ Railway deployment files created!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy to Railway: cd .wasp/build/server && railway up"
echo "2. Set environment variables in Railway dashboard"
echo "3. Connect your database"
echo ""
echo "🔑 Required environment variables:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - WASP_WEB_CLIENT_URL"
echo "   - WASP_SERVER_URL"