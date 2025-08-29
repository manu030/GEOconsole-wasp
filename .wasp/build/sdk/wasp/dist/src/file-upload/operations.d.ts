import * as z from 'zod';
import { type File } from 'wasp/entities';
import { type CreateFile, type GetAllFilesByUser, type GetDownloadFileSignedURL } from 'wasp/server/operations';
declare const createFileInputSchema: z.ZodObject<{
    fileType: z.ZodEnum<["image/jpeg", "image/png", "application/pdf", "text/*", "video/quicktime", "video/mp4"]>;
    fileName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fileName: string;
    fileType: "image/jpeg" | "image/png" | "application/pdf" | "text/*" | "video/quicktime" | "video/mp4";
}, {
    fileName: string;
    fileType: "image/jpeg" | "image/png" | "application/pdf" | "text/*" | "video/quicktime" | "video/mp4";
}>;
type CreateFileInput = z.infer<typeof createFileInputSchema>;
export declare const createFile: CreateFile<CreateFileInput, {
    s3UploadUrl: string;
    s3UploadFields: Record<string, string>;
}>;
export declare const getAllFilesByUser: GetAllFilesByUser<void, File[]>;
declare const getDownloadFileSignedURLInputSchema: z.ZodObject<{
    key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    key: string;
}, {
    key: string;
}>;
type GetDownloadFileSignedURLInput = z.infer<typeof getDownloadFileSignedURLInputSchema>;
export declare const getDownloadFileSignedURL: GetDownloadFileSignedURL<GetDownloadFileSignedURLInput, string>;
export {};
//# sourceMappingURL=operations.d.ts.map