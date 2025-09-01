import { HttpError, type MiddlewareConfigFn } from 'wasp/server'
import { prisma } from 'wasp/server'
import type { Request, Response } from 'express'

export const healthCheck = async (req: Request, res: Response, context?: any) => {
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: 'ok' as string,
        memory: {} as any
      }
    }

    // Test database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`
      healthStatus.checks.database = 'ok'
    } catch (dbError) {
      console.error('Database health check failed:', dbError)
      healthStatus.checks.database = 'error'
      healthStatus.status = 'degraded'
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage()
    const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
    
    let memoryStatus = 'ok'
    if (memoryUsedMB > 1024) { // Alert if using more than 1GB
      memoryStatus = 'warning'
      healthStatus.status = healthStatus.status === 'ok' ? 'warning' : healthStatus.status
    }

    // Add memory info for debugging
    healthStatus.checks.memory = {
      status: memoryStatus,
      heapUsed: `${memoryUsedMB}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
    }

    // Set appropriate HTTP status code
    const statusCode = healthStatus.status === 'ok' ? 200 : 
                      healthStatus.status === 'warning' ? 200 : 503

    return res.status(statusCode).json(healthStatus)

  } catch (error) {
    console.error('Health check failed:', error)
    
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'production' ? 'Service unavailable' : (error as Error).message
    })
  }
}

export const healthMiddlewareConfigFn: MiddlewareConfigFn = (middlewareConfig) => {
  // No special middleware needed for health endpoint - it should be publicly accessible
  // Keep the default middleware as is - health checks should work with standard Express middleware
  return middlewareConfig
}