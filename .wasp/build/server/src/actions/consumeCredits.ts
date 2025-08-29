import { prisma } from 'wasp/server'

import { consumeCredits } from '../../../../../src/credit/operations'


export default async function (args, context) {
  return (consumeCredits as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
    },
  })
}
