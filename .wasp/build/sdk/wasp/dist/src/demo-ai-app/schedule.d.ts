export type TaskPriority = 'low' | 'medium' | 'high';
export type GeneratedSchedule = {
    tasks: Task[];
    taskItems: TaskItem[];
};
export type Task = {
    name: string;
    priority: TaskPriority;
};
export type TaskItem = {
    description: string;
    time: number;
    taskName: string;
};
//# sourceMappingURL=schedule.d.ts.map