export interface ITask {
    subject: string;
    body: string;
    DocId: string;
    method?: string;
    parentId: string;
    createdDateTime?: string;
    completedDateTime?: string;
    dueDateTime?: string;
    startDateTime?: string;
    status?: string;
    priority?: string;
    importance?: string;
    sensitivity?: string;
    assignedTo?: string;
    categories?: string[],
    reminder?: boolean;
    reminderDateTime?: string;
    percentComplete?: number;
    recurrence?: string;
    hasAttachments?: boolean;
    history?: any;
    outlook?: boolean;
    createdOn?: string;
    createdBy?: string;
    createdByName?: string;
}
