import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map, tap} from 'rxjs/operators';
import {IServerDropdownOption, ServerDropdownOption} from '../models/server-dropdown';
import {IMailTemplate} from '../models/mail-template';
import {Observable} from 'rxjs';
import {IGridDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';
import {IApiResponseBody} from '../models/api-response-body';

@Injectable({
    providedIn: 'root',
})
export class MailTemplateService {

    static adapt(fields): IMailTemplate {
        console.log(fields);
        return {
            DocId: fields.DocId ? fields.DocId : `${fields._type}::${fields._id}`,
            title: fields.title,
            goal: fields.goal,
            subject: fields.subject,
            message_body: fields.message_body,
            signature: fields.signature,
            tags: fields.tags,
            librarys: fields.librarys,
            last_modified: fields.last_modified,
            last_modified_by: fields.last_modified_by,
        }
    }

    constructor(public api: ApiService) {
    }

    getAll(params?: { rowCount?: string | number, offset?: string | number }): Observable<IMailTemplate[]> {
        return this.api.get({endpoint: `/template/list?rowCount=${params.rowCount}&offset=${params.offset}`}).pipe(
            map((res: any) => res.Data.map(fields => {
                return MailTemplateService.adapt(fields);
            })),
        );
    }

    getAllTemplates(params?: IGridDataFetcherParams) {
       
        return this.api.get({
            endpoint: '/template/list',
            params: {
                rowCount: params.perPage,
                offset: params.offset,

                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.tags && {tags: params.tags}),
                ...(params.librarys && {librarys: params.librarys}),
            },
            useAuthUrl: false,
        }).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res)),
        );
    }

    tagList(): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: '/cblookup/template_category', useAuthUrl: true}).pipe(
            map((res: any) => {
                return res.Data.map(option => {
                    return new ServerDropdownOption({
                        value: option.id,
                        name: option.text,
                        selected: option.selected,
                    })
                })
            }),
        );
    }

    libraryList(): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: '/cblookup/template_library', useAuthUrl: true}).pipe(
            map((res: any) => {
                return res.Data.map(option => {
                    return new ServerDropdownOption({
                        value: option.id,
                        name: option.text,
                        selected: option.selected,
                    })
                })
            }),
        );
    }

    templateLookup(guid: string) {
        return this.api.get({endpoint: `/api/cblookup/${guid}`}).pipe(
            map((res: any) => res.Data.map(template => {
                return new ServerDropdownOption({
                    name: template.id,
                    value: template.name,
                    selected: template.selected
                });
            })),
        );
    }

    create(formData: IMailTemplate) {
        return this.api.post({endpoint: '/template/new', body: formData});
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/template/detail/${DocId}`}).pipe(
            map((res: any) => MailTemplateService.adapt(res.Data)),
        );
    }

    update(param: { DocId: string; formData: IMailTemplate }) {
        console.log(param.DocId)
        return this.api.post({endpoint: `/template/update/${param.DocId}`, body: param.formData});
    }

    delete(DocId: string) {
        return this.api.delete({endpoint: `/template/${DocId}`});
    }

}
