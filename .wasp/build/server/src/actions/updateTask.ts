import { prisma } from 'wasp/server'

import { updateTask } from '../../../../../src/demo-ai-app/operations'


export default async function (args, context) {
  return (updateTask as any)(args, {
    ...context,
    entities: {
      Task: prisma.task,
    },
  })
}
