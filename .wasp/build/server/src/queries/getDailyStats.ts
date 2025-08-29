import { prisma } from 'wasp/server'

import { getDailyStats } from '../../../../../src/analytics/operations'


export default async function (args, context) {
  return (getDailyStats as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
      DailyStats: prisma.dailyStats,
    },
  })
}
