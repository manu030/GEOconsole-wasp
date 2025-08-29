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

# Copy the pre-built bundle
COPY .wasp/build/server/bundle ./bundle

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Generate Prisma client
RUN npx prisma generate --schema=../db/schema.prisma

# Expose port
EXPOSE 3000

# Start the application directly (no build needed)
CMD ["npm", "run", "start-production"]