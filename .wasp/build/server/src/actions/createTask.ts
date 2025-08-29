import { prisma } from 'wasp/server'

import { createTask } from '../../../../../src/demo-ai-app/operations'


export default async function (args, context) {
  return (createTask as any)(args, {
    ...context,
    entities: {
      Task: prisma.task,
    },
  })
}
