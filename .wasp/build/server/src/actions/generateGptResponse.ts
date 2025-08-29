import { prisma } from 'wasp/server'

import { generateGptResponse } from '../../../../../src/demo-ai-app/operations'


export default async function (args, context) {
  return (generateGptResponse as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
      Task: prisma.task,
      GptResponse: prisma.gptResponse,
    },
  })
}
