import { type QueryFor } from './core';
import { GetPaginatedUsers_ext } from 'wasp/server/operations/queries';
import { GetGptResponses_ext } from 'wasp/server/operations/queries';
import { GetAllTasksByUser_ext } from 'wasp/server/operations/queries';
import { GetUserCredits_ext } from 'wasp/server/operations/queries';
import { GetCustomerPortalUrl_ext } from 'wasp/server/operations/queries';
import { GetAllFilesByUser_ext } from 'wasp/server/operations/queries';
import { GetDownloadFileSignedURL_ext } from 'wasp/server/operations/queries';
import { GetDailyStats_ext } from 'wasp/server/operations/queries';
export declare const getPaginatedUsers: QueryFor<GetPaginatedUsers_ext>;
export declare const getGptResponses: QueryFor<GetGptResponses_ext>;
export declare const getAllTasksByUser: QueryFor<GetAllTasksByUser_ext>;
export declare const getUserCredits: QueryFor<GetUserCredits_ext>;
export declare const getCustomerPortalUrl: QueryFor<GetCustomerPortalUrl_ext>;
export declare const getAllFilesByUser: QueryFor<GetAllFilesByUser_ext>;
export declare const getDownloadFileSignedURL: QueryFor<GetDownloadFileSignedURL_ext>;
export declare const getDailyStats: QueryFor<GetDailyStats_ext>;
export { buildAndRegisterQuery } from './core';
//# sourceMappingURL=index.d.ts.map