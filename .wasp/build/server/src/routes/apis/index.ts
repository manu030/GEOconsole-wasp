import express from 'express'
import { prisma } from 'wasp/server'
import { defineHandler } from 'wasp/server/utils'
import { MiddlewareConfigFn, globalMiddlewareConfigForExpress } from '../../middleware/index.js'
import auth from 'wasp/core/auth'
import { type AuthUserData, makeAuthUserIfPossible } from 'wasp/auth/user'


import { paymentsWebhook as _wasppaymentsWebhookfn } from '../../../../../../src/payment/webhook'
import { paymentsMiddlewareConfigFn as _wasppaymentsWebhookmiddlewareConfigFn } from '../../../../../../src/payment/webhook'
import { healthCheck as _wasphealthCheckfn } from '../../../../../../src/health/health'
import { healthMiddlewareConfigFn as _wasphealthCheckmiddlewareConfigFn } from '../../../../../../src/health/health'

const idFn: MiddlewareConfigFn = x => x


const router = express.Router()


const paymentsWebhookMiddleware = globalMiddlewareConfigForExpress(_wasppaymentsWebhookmiddlewareConfigFn)
router.post(
  '/payments-webhook',
  [auth, ...paymentsWebhookMiddleware],
  defineHandler(
    (
      req: Parameters<typeof _wasppaymentsWebhookfn>[0] & { user: AuthUserData | null },
      res: Parameters<typeof _wasppaymentsWebhookfn>[1],
    ) => {
      const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {
          User: prisma.user,
        },
      }
      return _wasppaymentsWebhookfn(req, res, context)
    }
  )
)
const healthCheckMiddleware = globalMiddlewareConfigForExpress(_wasphealthCheckmiddlewareConfigFn)
router.get(
  '/api/health',
  [auth, ...healthCheckMiddleware],
  defineHandler(
    (
      req: Parameters<typeof _wasphealthCheckfn>[0] & { user: AuthUserData | null },
      res: Parameters<typeof _wasphealthCheckfn>[1],
    ) => {
      const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {
        },
      }
      return _wasphealthCheckfn(req, res, context)
    }
  )
)

export default router
