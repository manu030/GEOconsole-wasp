import { prisma } from 'wasp/server'

import { getAllFilesByUser } from '../../../../../src/file-upload/operations'


export default async function (args, context) {
  return (getAllFilesByUser as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
      File: prisma.file,
    },
  })
}
