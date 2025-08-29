import { createAction } from './core';
// PUBLIC API
export const updateIsUserAdminById = createAction('operations/update-is-user-admin-by-id', ['User']);
// PUBLIC API
export const generateGptResponse = createAction('operations/generate-gpt-response', ['User', 'Task', 'GptResponse']);
// PUBLIC API
export const createTask = createAction('operations/create-task', ['Task']);
// PUBLIC API
export const deleteTask = createAction('operations/delete-task', ['Task']);
// PUBLIC API
export const updateTask = createAction('operations/update-task', ['Task']);
// PUBLIC API
export const consumeCredits = createAction('operations/consume-credits', ['User']);
// PUBLIC API
export const generateCheckoutSession = createAction('operations/generate-checkout-session', ['User']);
// PUBLIC API
export const createFile = createAction('operations/create-file', ['User', 'File']);
//# sourceMappingURL=index.js.map