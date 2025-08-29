import { prisma } from 'wasp/server'

import { getUserCredits } from '../../../../../src/credit/operations'


export default async function (args, context) {
  return (getUserCredits as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
    },
  })
}
