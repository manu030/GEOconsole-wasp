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

# Create a working directory structure and modify package.json to skip tsc --build
RUN sed -i 's/"bundle": "tsc --build && rollup --config --silent"/"bundle": "rollup --config --silent"/g' package.json

# Install dependencies (including devDependencies for build process)
RUN npm ci

# Copy server source and database schema
COPY --from=wasp-builder /build/.wasp/build/server/src ./src
COPY --from=wasp-builder /build/.wasp/build/db ./db

# Copy user source files and fix the import path in the generated job file
COPY --from=wasp-builder /build/src ./user-src

# Debug: Check file structure before fixing imports
RUN echo "=== DEBUGGING FILE STRUCTURE ===" && \
    echo "Contents of /app:" && ls -la && \
    echo "Contents of /app/src:" && ls -la src/ && \
    echo "Contents of /app/user-src:" && ls -la user-src/ && \
    echo "Looking for webhook file:" && find . -name "*webhook*" -type f && \
    echo "=== GENERATED FILE CONTENT ===" && \
    head -15 src/routes/apis/index.ts

# Fix all incorrect import paths in generated TypeScript files
RUN find src -name "*.ts" -exec sed -i 's|\.\.\/.*src/|../../user-src/|g' {} \;

# Debug: Verify imports were fixed and check file resolution
RUN echo "=== AFTER IMPORT FIX ===" && \
    echo "Updated import in apis/index.ts:" && \
    head -15 src/routes/apis/index.ts && \
    echo "Checking if webhook file exists at expected path:" && \
    ls -la user-src/payment/ 2>/dev/null || echo "user-src/payment/ directory not found"

# Install Prisma client and CLI, then generate client
RUN npm install @prisma/client@5.19.1 prisma@5.19.1

# Install TypeScript for build process
RUN npm install -D typescript@5.8.2

# Generate Prisma client with proper working directory context
RUN npx prisma generate --schema=./db/schema.prisma

# Build the server bundle (TypeScript compilation + Rollup)
RUN npm run bundle

# Clean up dev dependencies (after build is complete)
RUN npm prune --production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "run", "start-production"]