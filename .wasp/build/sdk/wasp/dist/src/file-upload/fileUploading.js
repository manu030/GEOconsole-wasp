import { createFile } from 'wasp/client/operations';
import axios from 'axios';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from './validation';
export async function uploadFileWithProgress({ file, setUploadProgressPercent }) {
    const { s3UploadUrl, s3UploadFields } = await createFile({ fileType: file.type, fileName: file.name });
    const formData = getFileUploadFormData(file, s3UploadFields);
    return axios.post(s3UploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                setUploadProgressPercent(percentage);
            }
        },
    });
}
function getFileUploadFormData(file, s3UploadFields) {
    const formData = new FormData();
    Object.entries(s3UploadFields).forEach(([key, value]) => {
        formData.append(key, value);
    });
    formData.append('file', file);
    return formData;
}
export function validateFile(file) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            message: `File size exceeds ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB limit.`,
            code: 'FILE_TOO_LARGE',
        };
    }
    if (!isAllowedFileType(file.type)) {
        return {
            message: `File type '${file.type}' is not supported.`,
            code: 'INVALID_FILE_TYPE',
        };
    }
    return null;
}
function isAllowedFileType(fileType) {
    return ALLOWED_FILE_TYPES.includes(fileType);
}
//# sourceMappingURL=fileUploading.js.map