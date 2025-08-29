type S3Upload = {
    fileType: string;
    fileName: string;
    userId: string;
};
export declare const getUploadFileSignedURLFromS3: ({ fileName, fileType, userId }: S3Upload) => Promise<{
    s3UploadUrl: string;
    key: string;
    s3UploadFields: {
        [x: string]: string;
    };
}>;
export declare const getDownloadFileSignedURLFromS3: ({ key }: {
    key: string;
}) => Promise<string>;
export {};
//# sourceMappingURL=s3Utils.d.ts.map