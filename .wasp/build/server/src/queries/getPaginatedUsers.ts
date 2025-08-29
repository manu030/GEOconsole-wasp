import { prisma } from 'wasp/server'

import { getPaginatedUsers } from '../../../../../src/user/operations'


export default async function (args, context) {
  return (getPaginatedUsers as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
    },
  })
}
