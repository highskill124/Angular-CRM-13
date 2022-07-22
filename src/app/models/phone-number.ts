export interface IPhoneNumber {
    id: string;
    parentId: string;
    type: string;
    number: string;
    source?: string;
    description?: string;
    sms?: boolean;
    dflt?: boolean;
}
