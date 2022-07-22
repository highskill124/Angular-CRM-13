/**
 * Creating this new note interface as base note since we already have a note interface that was used with Vendors.
 * However their properties are different so the note interface used for vendor can't be used for this purpose.
 */
export interface IBaseNote {
    DocId: string;
    parentid: string;
    subject: string;
    notes: string;
    created_by?: string;
    created_on?: string;
    created_by_name?: string;
    updated_by?: string;
    updated_on?: string;
    updated_by_name?: string;
}

