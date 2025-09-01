# NOTE: Why do we specify alpine version here?
#   Because if not, we had situations where it would use the different version
#   locally and on Github CI. This way we ensure exact version is used,
#   and also have control over updating it (instead of update surprising us).
FROM node:20.0.0-alpine3.17 AS node


# We split Dockerfile into base, server-builder and server-production.
# This way we have separate situations -> in server-builder we build all
# we need to run the server, and then in server-production we start fresh
# and just copy what we need from server-builder, avoiding intermediate
# artifacts and any settings / pollution we don't need in production
# but only for building.


FROM node AS base
RUN apk --no-cache -U upgrade # To ensure any potential security patches are applied.


# Todo: The 'server-builder' image stays on disk under <none>:<none> and is
# relatively large (~900 MB), should we remove it? Or is it useful for future
# builds?
FROM base AS server-builder
# Building the Docker image on Apple's Silicon Mac fails without python3 (the build
# throws `node-gyp` errors when it tries to compile native deps. Installing
# `python3` fixes the issue.
RUN apk add --no-cache python3 build-base libtool autoconf automake
WORKDIR /app
# Since the framwork code in /.wasp/build/server imports the user code in /src
# using relative imports, we must mirror the same directory structure in the
# Docker image.
COPY src ./src
COPY package.json .
COPY package-lock.json .
COPY tsconfig*.json .
COPY server .wasp/build/server
COPY sdk .wasp/out/sdk
# Install npm packages, resulting in node_modules/.
RUN npm install && cd .wasp/build/server && npm install
COPY db/schema.prisma .wasp/build/db/
RUN cd .wasp/build/server && npx prisma generate --schema='../db/schema.prisma'
# Building the server should come after Prisma generation.
RUN cd .wasp/build/server && npm run bundle


# TODO: Use pm2?
# TODO: Use non-root user (node).
FROM base AS server-production
# In case they want to use python3 in their app.
RUN apk add --no-cache python3
ENV NODE_ENV=production
WORKDIR /app
# Copying the top level 'node_modules' because it contains the Prisma packages
# necessary for migrating the database.
COPY --from=server-builder /app/node_modules ./node_modules
# Copying 'server/node_modules' because we require dotenv package to
# load environment variables
# TODO: replace dotenv with native Node.js environment variable loading
COPY --from=server-builder /app/.wasp/build/server/node_modules .wasp/build/server/node_modules
COPY --from=server-builder /app/.wasp/build/server/bundle .wasp/build/server/bundle
COPY --from=server-builder /app/.wasp/build/server/package*.json .wasp/build/server/
COPY db/ .wasp/build/db/
EXPOSE ${PORT}
WORKDIR /app/.wasp/build/server
ENTRYPOINT ["npm", "run", "start-production"]


# Any user-defined Dockerfile contents will be appended below.
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

# Fix all incorrect import paths in generated TypeScript files with proper path calculation
RUN find src -name "*.ts" -exec sh -c '\
    file="$1"; \
    depth=$(echo "$file" | grep -o "/" | wc -l); \
    depth=$((depth - 1)); \
    prefix=""; \
    for i in $(seq 1 $((depth + 1))); do prefix="${prefix}../"; done; \
    sed -i "s|\\.\\./.*src/|${prefix}user-src/|g" "$file"; \
    echo "Fixed imports in $file (depth: $depth, prefix: $prefix)"; \
' sh {} \;

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
