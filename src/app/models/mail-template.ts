import {IGridAction} from './grid';

export interface IMailTemplate {
    DocId: string;
    title: string;
    goal: string;
    subject: string;
    message_body: string;
    signature: string;
    tags: string[];
    librarys: string[];
    last_modified: string;
    last_modified_by: string;
}

export interface IMailTemplateGrid extends IMailTemplate {
    actions?: IGridAction[];
}
