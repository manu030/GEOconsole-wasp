import { prisma } from 'wasp/server'

import { getGptResponses } from '../../../../../src/demo-ai-app/operations'


export default async function (args, context) {
  return (getGptResponses as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
      GptResponse: prisma.gptResponse,
    },
  })
}
