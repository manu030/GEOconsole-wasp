import express from 'express'
import { prisma } from 'wasp/server'
import { defineHandler } from 'wasp/server/utils'
import { MiddlewareConfigFn, globalMiddlewareConfigForExpress } from '../../middleware/index.js'
import auth from 'wasp/core/auth'
import { type AuthUserData, makeAuthUserIfPossible } from 'wasp/auth/user'


import { paymentsWebhook as _wasppaymentsWebhookfn } from '../../../../../../src/payment/webhook'
import { paymentsMiddlewareConfigFn as _wasppaymentsWebhookmiddlewareConfigFn } from '../../../../../../src/payment/webhook'

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

export default router
