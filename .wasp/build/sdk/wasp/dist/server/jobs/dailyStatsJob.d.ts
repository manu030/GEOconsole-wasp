import type { JSONValue, JSONObject } from 'wasp/core/serialization';
import { type JobFn } from 'wasp/server/jobs/core/pgBoss';
declare const entities: {
    User: import(".prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library.js").DefaultArgs>;
    DailyStats: import(".prisma/client").Prisma.DailyStatsDelegate<import("@prisma/client/runtime/library.js").DefaultArgs>;
    Logs: import(".prisma/client").Prisma.LogsDelegate<import("@prisma/client/runtime/library.js").DefaultArgs>;
    PageViewSource: import(".prisma/client").Prisma.PageViewSourceDelegate<import("@prisma/client/runtime/library.js").DefaultArgs>;
};
export type DailyStatsJob<Input extends JSONObject, Output extends JSONValue | void> = JobFn<Input, Output, typeof entities>;
export declare const dailyStatsJob: import("./core/pgBoss/pgBossJob").PgBossJob<JSONObject, void | JSONValue, {
    User: import(".prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library.js").DefaultArgs>;
    DailyStats: import(".prisma/client").Prisma.DailyStatsDelegate<import("@prisma/client/runtime/library.js").DefaultArgs>;
    Logs: import(".prisma/client").Prisma.LogsDelegate<import("@prisma/client/runtime/library.js").DefaultArgs>;
    PageViewSource: import(".prisma/client").Prisma.PageViewSourceDelegate<import("@prisma/client/runtime/library.js").DefaultArgs>;
}>;
export {};
//# sourceMappingURL=dailyStatsJob.d.ts.map