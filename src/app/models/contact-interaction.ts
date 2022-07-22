export interface IInteraction {
    DocId: string;
    parent_id: string;
    followup_id?: string
    type: string;
    time: string;
    subject: string;
    notes: string;
    reminder_date?: Date,
    reminder_time?: Date,
    flag_to?: string,
}
