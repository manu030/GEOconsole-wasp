# Railway Deployment Guide for Wasp Application

## Problem Solved

This guide fixes the Railway deployment issue where the container couldn't find `/app/bundle/server.js`. The root cause was that Railway was trying to build from pre-built files that don't exist in the repository (since `.wasp/build` is gitignored).

## Solution Overview

The new deployment approach uses a **multi-stage Docker build** that:
1. Installs Wasp CLI in the first stage
2. Builds the Wasp application from source
3. Copies only the necessary built files to the production stage
4. Builds the server bundle in the container
5. Runs database migrations and starts the server

## Files Updated

- `/Users/manuelsierra/AI-apps/GEOconsole-wasp/Dockerfile` - Multi-stage build configuration
- `/Users/manuelsierra/AI-apps/GEOconsole-wasp/railway.json` - Railway platform configuration
- `/Users/manuelsierra/AI-apps/GEOconsole-wasp/.dockerignore` - Optimized build context
- `/Users/manuelsierra/AI-apps/GEOconsole-wasp/deploy-railway.sh` - Updated deployment script

## Quick Deployment

1. **Prepare Railway CLI** (if not done already):
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Link to your Railway project
   railway link [project-id]
   ```

2. **Deploy using the script**:
   ```bash
   chmod +x deploy-railway.sh
   ./deploy-railway.sh
   ```

3. **Set required environment variables**:
   ```bash
   railway variables set DATABASE_URL="postgresql://user:pass@host:port/dbname"
   railway variables set JWT_SECRET="your-super-secret-jwt-key"
   railway variables set WASP_WEB_CLIENT_URL="https://your-frontend.railway.app"
   railway variables set WASP_SERVER_URL="https://your-backend.railway.app"
   ```

## Manual Deployment

If you prefer manual deployment:

1. **Deploy from repository root**:
   ```bash
   railway up
   ```

2. **Monitor deployment**:
   ```bash
   railway logs --follow
   ```

## Environment Variables Setup

Set these **before** deployment for best results:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-key-change-this` |
| `WASP_WEB_CLIENT_URL` | Frontend URL | `https://your-app.railway.app` |
| `WASP_SERVER_URL` | Backend URL | `https://your-api.railway.app` |

## Deployment Process

### Stage 1: Wasp Builder
1. Installs Node.js 22 and system dependencies
2. Downloads and installs Wasp CLI
3. Copies your entire project source
4. Runs `wasp build` to generate `.wasp/build/`

### Stage 2: Production
1. Creates clean production container
2. Copies built server files from stage 1
3. Installs Node.js dependencies
4. Generates Prisma client
5. Compiles TypeScript and bundles with Rollup
6. Removes dev dependencies
7. Sets up health checks

### Runtime
1. Runs database migrations (`prisma migrate deploy`)
2. Starts the server (`node bundle/server.js`)
3. Health checks ensure the app is responding

## Troubleshooting

### Build Failures

**Error: "wasp: command not found"**
- Wasp CLI installation failed. Check network connection.
- Ensure the Wasp installer can access GitHub releases.

**Error: "Cannot find module '/app/bundle/server.js'"**
- The bundle build step failed silently.
- Check that `npm run bundle` succeeds in the container.
- Verify TypeScript compilation with `tsc --build`.

**Error: "Prisma schema not found"**
- Database schema wasn't copied correctly.
- Ensure `.wasp/build/db/schema.prisma` exists after `wasp build`.

### Runtime Errors

**Error: "Database connection failed"**
- Check `DATABASE_URL` environment variable.
- Ensure the database is accessible from Railway.
- Verify database credentials.

**Error: "JWT_SECRET is required"**
- Set the `JWT_SECRET` environment variable.
- Make sure it's a secure, random string.

### Performance Issues

**Slow startup times**
- Increase Railway service resources.
- Check Prisma migrations aren't taking too long.
- Monitor container resource usage.

## Health Monitoring

The Dockerfile includes a health check that:
- Runs every 30 seconds
- Times out after 10 seconds
- Starts checking after 60 seconds
- Restarts container after 3 failed checks

Health check endpoint: `GET /api/health`

## Rollback Plan

If deployment fails:

1. **Revert to previous version**:
   ```bash
   railway rollback
   ```

2. **Use old Dockerfile** (backup):
   ```dockerfile
   FROM node:22-slim
   WORKDIR /app
   RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
   COPY .wasp/build/server ./
   COPY .wasp/build/db ../db
   RUN npm ci
   RUN npx prisma generate --schema=../db/schema.prisma
   RUN npm run bundle
   RUN npm prune --production
   EXPOSE 3000
   CMD ["npm", "run", "start-production"]
   ```

3. **Manual build approach**:
   ```bash
   # Build locally and push built files
   wasp build
   cd .wasp/build/server
   railway up
   ```

## Production Checklist

Before deploying to production:

- [ ] Database is provisioned and accessible
- [ ] All environment variables are set
- [ ] JWT_SECRET is secure and unique
- [ ] Domain is configured (optional)
- [ ] SSL certificate is active
- [ ] Health checks are responding
- [ ] Database migrations complete successfully
- [ ] Application logs show no errors

## Security Notes

- The Dockerfile uses non-root user for better security
- Only production dependencies are included in final image
- Health checks help detect compromised containers
- Environment variables should never be committed to git
- Use Railway's built-in secret management

## Performance Optimization

The multi-stage build approach provides several benefits:
- **Smaller final image**: Dev dependencies are removed
- **Faster deployments**: Build cache layers are reused
- **Better security**: Only necessary files in production
- **Improved reliability**: Build failures stop deployment early

## Next Steps

After successful deployment:

1. **Monitor performance**: Use Railway metrics
2. **Set up alerts**: Configure notification channels
3. **Domain setup**: Add custom domain if needed
4. **SSL**: Railway provides automatic HTTPS
5. **Scaling**: Adjust resources based on usage
6. **Backups**: Set up database backup schedule