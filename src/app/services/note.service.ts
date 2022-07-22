import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {IBaseNote} from '../models/base-note';
import {map} from 'rxjs/operators';
import {IInteractionDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';
import {IApiResponseBody} from '../models/api-response-body';

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    static adapt(note): IBaseNote {
      
        return {
            DocId: note._id ? `notes::${note._id}` : note.DocId,
            parentid: note.parent_id,
            subject: note.subject,
            notes: note.notes.replace(/<[^>]*>/g, ''),
            created_by_name: note.created_by_name,
            created_on: note.history.created_on,
            created_by: note.history.created_by,
        };
    }

    static adaptNew(note): IBaseNote {
      
        return {
            DocId: note._id ? `notes::${note._id}` : note.DocId,
            parentid: note.parent_id,
            subject: note.subject,
            notes: note.notes,
            created_by_name: note.history.created_by_name,
            created_on: note.history.created_on,
            created_by: note.history.created_by,
            updated_by_name: note.history.updated_by_name,
            updated_on: note.history.updated_on,
            updated_by: note.history.updated_by
        };
    }

    constructor(private api: ApiService) {
    }

    create(note: Partial<IBaseNote>) {
        return this.api.post({endpoint: `/note`, body: note, useAuthUrl: true})
            .pipe(
                map(res => res as IApiResponseBody),
                map((res: IApiResponseBody) => {
                    console.log(res);
                    return res;
                }),
            );
    }

    getAll(contactId: string, params?: IInteractionDataFetcherParams) {
        return this.api.get({
            endpoint: `/notes/${contactId}`,
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.type && {type: params.type}),
            },
            useAuthUrl: true,
        }).pipe(
            map(res => res as IApiResponseBody),
            map((res: IApiResponseBody) => {
                res.Data = res.Data && res.Data.map(note => {
                    // construct DocId and return data as received
                    return NoteService.adapt(note);
                });
                // console.log(res.Data);
                return res;
            }),
        );
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/note/${DocId}`, useAuthUrl: true}).pipe(
            map((res: any) => NoteService.adaptNew(res.Data)),
        );
    }

    update(param: { DocId: string; formData: IBaseNote }) {
        return this.api.patch({endpoint: `/note/${param.DocId}`, body: param.formData, useAuthUrl: true});
    }

    delete(id: string) {
        return this.api.delete({endpoint: `/note/${id}`, useAuthUrl: true});
    }
}
