import { registerJob } from 'wasp/server/jobs/core/pgBoss'
import { calculateDailyStats } from '../../../../../src/analytics/stats'
import { dailyStatsJob as _waspJobDefinition } from 'wasp/server/jobs'

registerJob({
  job: _waspJobDefinition,
  jobFn: calculateDailyStats,
})
