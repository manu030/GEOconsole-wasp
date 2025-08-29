import { prisma } from 'wasp/server'

import { generateCheckoutSession } from '../../../../../src/payment/operations'


export default async function (args, context) {
  return (generateCheckoutSession as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
    },
  })
}
