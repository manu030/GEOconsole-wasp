import { prisma } from 'wasp/server'

import { getAllTasksByUser } from '../../../../../src/demo-ai-app/operations'


export default async function (args, context) {
  return (getAllTasksByUser as any)(args, {
    ...context,
    entities: {
      Task: prisma.task,
    },
  })
}
