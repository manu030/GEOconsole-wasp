FROM node:22-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy entire server build directory (already compiled by Wasp)
COPY .wasp/build/server ./

# Copy database schema
COPY .wasp/build/db ../db

# Install ALL dependencies temporarily for building
RUN npm ci

# Generate Prisma client
RUN npx prisma generate --schema=../db/schema.prisma

# Build the bundle
RUN npm run bundle

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the application directly
CMD ["npm", "run", "start-production"]