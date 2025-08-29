import { prisma } from 'wasp/server'

import { createFile } from '../../../../../src/file-upload/operations'


export default async function (args, context) {
  return (createFile as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
      File: prisma.file,
    },
  })
}
