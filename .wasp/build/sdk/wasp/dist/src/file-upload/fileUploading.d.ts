import { ALLOWED_FILE_TYPES } from './validation';
export type FileWithValidType = Omit<File, 'type'> & {
    type: AllowedFileType;
};
type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];
interface FileUploadProgress {
    file: FileWithValidType;
    setUploadProgressPercent: (percentage: number) => void;
}
export declare function uploadFileWithProgress({ file, setUploadProgressPercent }: FileUploadProgress): Promise<import("axios").AxiosResponse<any, any>>;
export interface FileUploadError {
    message: string;
    code: 'NO_FILE' | 'INVALID_FILE_TYPE' | 'FILE_TOO_LARGE' | 'UPLOAD_FAILED';
}
export declare function validateFile(file: File): {
    message: string;
    code: "FILE_TOO_LARGE";
} | {
    message: string;
    code: "INVALID_FILE_TYPE";
} | null;
export {};
//# sourceMappingURL=fileUploading.d.ts.map