
import { prisma } from 'wasp/server'
import {
  type UnauthenticatedOperationFor,
  createUnauthenticatedOperation,
  type AuthenticatedOperationFor,
  createAuthenticatedOperation,
} from '../wrappers.js'
import { getPaginatedUsers as getPaginatedUsers_ext } from 'wasp/src/user/operations'
import { getGptResponses as getGptResponses_ext } from 'wasp/src/demo-ai-app/operations'
import { getAllTasksByUser as getAllTasksByUser_ext } from 'wasp/src/demo-ai-app/operations'
import { getUserCredits as getUserCredits_ext } from 'wasp/src/credit/operations'
import { getCustomerPortalUrl as getCustomerPortalUrl_ext } from 'wasp/src/payment/operations'
import { getAllFilesByUser as getAllFilesByUser_ext } from 'wasp/src/file-upload/operations'
import { getDownloadFileSignedURL as getDownloadFileSignedURL_ext } from 'wasp/src/file-upload/operations'
import { getDailyStats as getDailyStats_ext } from 'wasp/src/analytics/operations'

// PRIVATE API
export type GetPaginatedUsers_ext = typeof getPaginatedUsers_ext

// PUBLIC API
export const getPaginatedUsers: AuthenticatedOperationFor<GetPaginatedUsers_ext> =
  createAuthenticatedOperation(
    getPaginatedUsers_ext,
    {
      User: prisma.user,
    },
  )


// PRIVATE API
export type GetGptResponses_ext = typeof getGptResponses_ext

// PUBLIC API
export const getGptResponses: AuthenticatedOperationFor<GetGptResponses_ext> =
  createAuthenticatedOperation(
    getGptResponses_ext,
    {
      User: prisma.user,
      GptResponse: prisma.gptResponse,
    },
  )


// PRIVATE API
export type GetAllTasksByUser_ext = typeof getAllTasksByUser_ext

// PUBLIC API
export const getAllTasksByUser: AuthenticatedOperationFor<GetAllTasksByUser_ext> =
  createAuthenticatedOperation(
    getAllTasksByUser_ext,
    {
      Task: prisma.task,
    },
  )


// PRIVATE API
export type GetUserCredits_ext = typeof getUserCredits_ext

// PUBLIC API
export const getUserCredits: AuthenticatedOperationFor<GetUserCredits_ext> =
  createAuthenticatedOperation(
    getUserCredits_ext,
    {
      User: prisma.user,
    },
  )


// PRIVATE API
export type GetCustomerPortalUrl_ext = typeof getCustomerPortalUrl_ext

// PUBLIC API
export const getCustomerPortalUrl: AuthenticatedOperationFor<GetCustomerPortalUrl_ext> =
  createAuthenticatedOperation(
    getCustomerPortalUrl_ext,
    {
      User: prisma.user,
    },
  )


// PRIVATE API
export type GetAllFilesByUser_ext = typeof getAllFilesByUser_ext

// PUBLIC API
export const getAllFilesByUser: AuthenticatedOperationFor<GetAllFilesByUser_ext> =
  createAuthenticatedOperation(
    getAllFilesByUser_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )


// PRIVATE API
export type GetDownloadFileSignedURL_ext = typeof getDownloadFileSignedURL_ext

// PUBLIC API
export const getDownloadFileSignedURL: AuthenticatedOperationFor<GetDownloadFileSignedURL_ext> =
  createAuthenticatedOperation(
    getDownloadFileSignedURL_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )


// PRIVATE API
export type GetDailyStats_ext = typeof getDailyStats_ext

// PUBLIC API
export const getDailyStats: AuthenticatedOperationFor<GetDailyStats_ext> =
  createAuthenticatedOperation(
    getDailyStats_ext,
    {
      User: prisma.user,
      DailyStats: prisma.dailyStats,
    },
  )

