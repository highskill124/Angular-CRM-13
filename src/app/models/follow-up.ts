export interface IFollowUp {
    DocId: string;
    completed?: boolean;
    start_date: string;
    end_date: string;
    notes: string;
    method: string;
    parent_id: string;
    flag_to?: string;
    reminder?: boolean;
    reminder_datetime?: string;
    created_by?: string;
    created_by_name?: string;
    created_on?: string;
    dueDateTime?: string;
    owner?: string;
    owner_name?: string;
}
