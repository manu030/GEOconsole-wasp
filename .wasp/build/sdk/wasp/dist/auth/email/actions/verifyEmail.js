import { api, handleApiError } from 'wasp/client/api';
// PUBLIC API
export async function verifyEmail(data) {
    try {
        const response = await api.post('/auth/email/verify-email', data);
        return response.data;
    }
    catch (e) {
        throw handleApiError(e);
    }
}
//# sourceMappingURL=verifyEmail.js.map