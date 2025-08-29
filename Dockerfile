FROM node:22-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy entire server build directory
COPY .wasp/build/server ./

# Copy database schema
COPY .wasp/build/db ../db

# Install all dependencies (including dev for building)
RUN npm ci --include=dev

# Generate Prisma client
RUN npx prisma generate --schema=../db/schema.prisma

# Expose port
EXPOSE 3000

# Build the bundle and start (override package.json start script)
CMD ["sh", "-c", "npm run bundle && npm run start-production"]
