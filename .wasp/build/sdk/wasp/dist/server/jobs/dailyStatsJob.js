import { prisma } from 'wasp/server';
import { createJobDefinition } from 'wasp/server/jobs/core/pgBoss';
const entities = {
    User: prisma.user,
    DailyStats: prisma.dailyStats,
    Logs: prisma.logs,
    PageViewSource: prisma.pageViewSource,
};
const jobSchedule = {
    cron: "0 * * * *",
    options: {},
};
// PUBLIC API
export const dailyStatsJob = createJobDefinition({
    jobName: 'dailyStatsJob',
    defaultJobOptions: {},
    jobSchedule,
    entities,
});
//# sourceMappingURL=dailyStatsJob.js.map