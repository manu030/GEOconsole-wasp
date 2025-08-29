import { prisma } from 'wasp/server'
import type { JSONValue, JSONObject } from 'wasp/core/serialization'
import { type JobFn, createJobDefinition } from 'wasp/server/jobs/core/pgBoss'

const entities = {
  User: prisma.user,
  DailyStats: prisma.dailyStats,
  Logs: prisma.logs,
  PageViewSource: prisma.pageViewSource,
}

// PUBLIC API
export type DailyStatsJob<Input extends JSONObject, Output extends JSONValue | void> = JobFn<Input, Output, typeof entities>

const jobSchedule = {
  cron: "0 * * * *",
  options: {},
}

// PUBLIC API
export const dailyStatsJob = createJobDefinition({
  jobName: 'dailyStatsJob',
  defaultJobOptions: {},
  jobSchedule,
  entities,
})
