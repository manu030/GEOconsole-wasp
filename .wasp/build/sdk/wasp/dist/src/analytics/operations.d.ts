import { type DailyStats, type PageViewSource } from 'wasp/entities';
import { type GetDailyStats } from 'wasp/server/operations';
type DailyStatsWithSources = DailyStats & {
    sources: PageViewSource[];
};
type DailyStatsValues = {
    dailyStats: DailyStatsWithSources;
    weeklyStats: DailyStatsWithSources[];
};
export declare const getDailyStats: GetDailyStats<void, DailyStatsValues | undefined>;
export {};
//# sourceMappingURL=operations.d.ts.map