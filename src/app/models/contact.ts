import {IFollowUp} from './follow-up';
import {IHistory} from './history';
import {IGridAction} from './grid';
import {IServerDropdownOption} from './server-dropdown';

export interface IContact {
    DocId: string;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    dob?: string;
    initials?: string;
    spouse_name?: string;
    file_as?: string;
    company_name?: string;
    job_title?: string;
    home_phone?: string;
    cell_phone?: string;
    office_phone?: string;
    fax_number?: string;
    email_address?: string;
    email_alternate?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    notes?: string;
    follow_up?: boolean;
    start_date?: string;
    end_date?: string;
    add_to_outlook?: boolean;
    tags?: Array<string | number>;
    buckets?: Array<string | number>;
}

export interface IMainContact {
    DocId: string;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    image?: string;
    dob?: string;
    initials?: string;
    spouse_name?: string;
    file_as?: string;
    company_name?: string;
    job_title?: string;
    notes?: string;
    phones?: Array<ILabeledPhoneInput>
    emails?: Array<ILabeledAddressInput>;
    websites?: Array<ILabeledAddressInput>;
    socials?: Array<ILabeledAddressInput>;
    addresses?: Array<IContactAddress>;
    recurring_events?: Array<IRecurringEventContact>;
    follow_ups?: Array<IFollowUp>;
    add_to_outlook?: boolean;
    tags?: Array<string>;
    buckets?: Array<string>;
    programs?: Array<string | number>;
    history?: IHistory;

}

export interface IGridContact {
    DocId: string;
    Name: string;
    buckets: IServerDropdownOption[];
    tags: IServerDropdownOption[];
    emails: IServerDropdownOption[];
    phones: IServerDropdownOption[];
    followup: IServerDropdownOption[];
    lastactivity: string;
}

export type IContactAddConnection = Pick<IGridContact, 'DocId' | 'Name'>;

export interface IMainContactGrid extends IMainContact {
    actions?: IGridAction[];
}

export interface IContactAddress {
    id: string;
    type: string;
    street: string;
    unit?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
}

export interface IRecurringEventContact {
    id: string;
    type: string;
    date: string;
    description?: string;
}

export interface ILabeledInput {
    id: string;
    type: string;
}

export interface ILabeledPhoneInput extends ILabeledInput {
    number: string;
    SMS?: boolean;
}

export interface ILabeledAddressInput extends ILabeledInput {
    address: string;
}
