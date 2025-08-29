import { type DailyStats } from 'wasp/entities';
import { type DailyStatsJob } from 'wasp/server/jobs';
export type DailyStatsProps = {
    dailyStats?: DailyStats;
    weeklyStats?: DailyStats[];
    isLoading?: boolean;
};
export declare const calculateDailyStats: DailyStatsJob<never, void>;
//# sourceMappingURL=stats.d.ts.map