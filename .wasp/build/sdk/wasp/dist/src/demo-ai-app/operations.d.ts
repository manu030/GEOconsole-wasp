import type { GptResponse, Task } from 'wasp/entities';
import type { CreateTask, DeleteTask, GenerateGptResponse, GetAllTasksByUser, GetGptResponses, UpdateTask } from 'wasp/server/operations';
import * as z from 'zod';
import { GeneratedSchedule } from './schedule';
declare const generateGptResponseInputSchema: z.ZodObject<{
    hours: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    hours: number;
}, {
    hours: number;
}>;
type GenerateGptResponseInput = z.infer<typeof generateGptResponseInputSchema>;
export declare const generateGptResponse: GenerateGptResponse<GenerateGptResponseInput, GeneratedSchedule>;
declare const createTaskInputSchema: z.ZodObject<{
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
}, {
    description: string;
}>;
type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export declare const createTask: CreateTask<CreateTaskInput, Task>;
declare const updateTaskInputSchema: z.ZodObject<{
    id: z.ZodString;
    isDone: z.ZodOptional<z.ZodBoolean>;
    time: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    time?: string | undefined;
    isDone?: boolean | undefined;
}, {
    id: string;
    time?: string | undefined;
    isDone?: boolean | undefined;
}>;
type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
export declare const updateTask: UpdateTask<UpdateTaskInput, Task>;
declare const deleteTaskInputSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
type DeleteTaskInput = z.infer<typeof deleteTaskInputSchema>;
export declare const deleteTask: DeleteTask<DeleteTaskInput, Task>;
export declare const getGptResponses: GetGptResponses<void, GptResponse[]>;
export declare const getAllTasksByUser: GetAllTasksByUser<void, Task[]>;
export {};
//# sourceMappingURL=operations.d.ts.map