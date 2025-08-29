import * as z from 'zod';
import { HttpError } from 'wasp/server';
import { getUploadFileSignedURLFromS3, getDownloadFileSignedURLFromS3 } from './s3Utils';
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation';
import { ALLOWED_FILE_TYPES } from './validation';
const createFileInputSchema = z.object({
    fileType: z.enum(ALLOWED_FILE_TYPES),
    fileName: z.string().nonempty(),
});
export const createFile = async (rawArgs, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }
    const { fileType, fileName } = ensureArgsSchemaOrThrowHttpError(createFileInputSchema, rawArgs);
    const { s3UploadUrl, s3UploadFields, key } = await getUploadFileSignedURLFromS3({
        fileType,
        fileName,
        userId: context.user.id,
    });
    await context.entities.File.create({
        data: {
            name: fileName,
            key,
            uploadUrl: s3UploadUrl,
            type: fileType,
            user: { connect: { id: context.user.id } },
        },
    });
    return {
        s3UploadUrl,
        s3UploadFields,
    };
};
export const getAllFilesByUser = async (_args, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }
    return context.entities.File.findMany({
        where: {
            user: {
                id: context.user.id,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
const getDownloadFileSignedURLInputSchema = z.object({ key: z.string().nonempty() });
export const getDownloadFileSignedURL = async (rawArgs, _context) => {
    const { key } = ensureArgsSchemaOrThrowHttpError(getDownloadFileSignedURLInputSchema, rawArgs);
    return await getDownloadFileSignedURLFromS3({ key });
};
//# sourceMappingURL=operations.js.map