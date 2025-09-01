# Multi-stage build for Wasp application
FROM --platform=linux/amd64 node:22-slim AS wasp-builder

# Install system dependencies including Wasp CLI
RUN apt-get update -y && \
    apt-get install -y curl openssl && \
    rm -rf /var/lib/apt/lists/*

# Install Wasp CLI and add to PATH
RUN curl -sSL https://get.wasp.sh/installer.sh | sh
ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /build

# Copy application source
COPY . .

# Build Wasp application
RUN wasp build

# Production stage
FROM node:22-slim AS production

WORKDIR /app

# Install system dependencies
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy built server from wasp-builder stage
COPY --from=wasp-builder /build/.wasp/build/server/package*.json ./
COPY --from=wasp-builder /build/.wasp/build/server/tsconfig.json ./
COPY --from=wasp-builder /build/.wasp/build/server/rollup.config.js ./

# Copy root tsconfig.json for project references
COPY --from=wasp-builder /build/tsconfig.json /tsconfig.json

# Create a working directory structure and modify package.json to skip tsc --build and fix schema path
RUN sed -i 's/"bundle": "tsc --build && rollup --config --silent"/"bundle": "rollup --config --silent"/g' package.json && \
    sed -i 's/"prisma migrate deploy --schema=..\/db\/schema.prisma"/"prisma migrate deploy --schema=.\/db\/schema.prisma"/g' package.json

# Install dependencies (including devDependencies for build process)
RUN npm ci

# Copy server source and database schema
COPY --from=wasp-builder /build/.wasp/build/server/src ./src
COPY --from=wasp-builder /build/.wasp/build/db ./db

# Copy user source files and fix the import path in the generated job file
COPY --from=wasp-builder /build/src ./user-src

# Copy Wasp SDK package for runtime (bundle contains imports that need resolution)
COPY --from=wasp-builder /build/.wasp/build/sdk/wasp ./node_modules/wasp

# Fix wasp package.json by adding missing export paths that are imported by the generated code
RUN cd ./node_modules/wasp && \
    cp package.json package.json.backup && \
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Add missing export paths that are imported by generated server code
      const additionalExports = {
        './server/jobs': './dist/server/jobs/index.js',
        './server/jobs/core/pgBoss': './dist/server/jobs/core/pgBoss/index.js',
        './server/auth': './dist/server/auth/index.js'
      };
      
      // Merge with existing exports
      Object.assign(pkg.exports, additionalExports);
      
      fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
      console.log('Fixed wasp package.json with missing exports');
    " && \
    echo "--- Updated wasp package.json exports ---" && \
    cat package.json | grep -A5 -B5 '"./server"'

# Fix all incorrect import paths in generated TypeScript files with proper path calculation
RUN find src -name "*.ts" -exec sh -c '\
    file="$1"; \
    depth=$(echo "$file" | grep -o "/" | wc -l); \
    depth=$((depth - 1)); \
    prefix=""; \
    for i in $(seq 1 $((depth + 1))); do prefix="${prefix}../"; done; \
    sed -i "s|\\.\\./.*src/|${prefix}user-src/|g" "$file"; \
' sh {} \;

# Install Prisma client and CLI, then generate client
RUN npm install @prisma/client@5.19.1 prisma@5.19.1

# Install TypeScript for build process
RUN npm install -D typescript@5.8.2

# Generate Prisma client with proper working directory context
RUN npx prisma generate --schema=./db/schema.prisma

# Build the server bundle (TypeScript compilation + Rollup)
RUN npm run bundle

# Note: We keep all dependencies because Wasp modules are needed at runtime

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "run", "start-production"]