export interface IContactConnection {
    DocId: string;
    parentid: string; // contact_id
    childid: string; // connection_id
    relationship: string; // relationship type id
}
