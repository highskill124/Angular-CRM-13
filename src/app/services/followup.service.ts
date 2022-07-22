import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map, tap} from 'rxjs/operators';
import {IGridDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';
import {IApiResponseBody} from '../models/api-response-body';
import {IFollowUp} from '../models/follow-up';

@Injectable({
    providedIn: 'root'
})
export class FollowupService {

    static adapt(followup): IFollowUp {
        return {
            DocId: followup.DocId,
            start_date: followup.startDateTime,
            end_date: followup.dueDateTime,
            completed: followup.completed,
            notes: followup.body,
            method: followup.method,
            flag_to: followup.method,
            parent_id: followup.parent_id,
            reminder: followup.reminder,
            reminder_datetime: followup.reminderDateTime,
            created_by: followup.created_by,
            created_by_name: followup.created_by_name,
            created_on: followup.created_on,
            owner: followup.owner,
            owner_name: followup.owner_name,
        };
    }

    constructor(private api: ApiService) {
    }

    create(formData: Partial<IFollowUp>) {
        return this.api.post({endpoint: `/followup`, body: formData, useAuthUrl: true})
            .pipe(
                map((res: any) => {
                    console.log(res);
                    return res;
                })
            );
    }

    getAll(parent_id: string, params?: IGridDataFetcherParams, adaptResponse = true) {
        return this.api.get({
            endpoint: `/followups/${parent_id || ''}`,
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.qstype ? {qstype: params.qstype} : {}),
            },
            useAuthUrl: true,
        }).pipe(
            tap(res => console.log(res)),
            map(res => res as IApiResponseBody),
            map((res: IApiResponseBody) => {
                if (adaptResponse) {
                    res.Data = res.Data && res.Data.map(note => {
                        // construct DocId and return data as received
                        return FollowupService.adapt(note);
                    });
                }
                return res;
            }),
        );
    }

    getAllUser(params?: IGridDataFetcherParams, adaptResponse = true) {
        return this.api.get({
            endpoint: `/followups`,
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.qstype ? {qstype: params.qstype} : {}),
            },
            useAuthUrl: true,
        }).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res)),
            map((res: IApiResponseBody) => {
                if (adaptResponse) {
                    res.Data = res.Data && res.Data.map(followup => {
                        // construct DocId and return data as received
                        return FollowupService.adapt(followup);
                    });
                }
                return res;
            }),
        );
    }
    fetch(id) {
        return this.api.get({endpoint: `/followup/${id}`, useAuthUrl: true}).pipe(
            tap(res => console.log(res)),
            map((res: any) => FollowupService.adapt(res.Data[0])),
        );
    }

    update(param: { id: string; formData: IFollowUp }) {
        return this.api.patch({endpoint: `/followup/${param.id}`, body: param.formData, useAuthUrl: true});
    }

    delete(DocId: string) {
        return this.api.delete({endpoint: `/followup/${DocId}`, useAuthUrl: true});
    }
    complete(DocId: string) {
        return this.api.get({endpoint: `/followupcomplete/${DocId}`, useAuthUrl: true});
    }
}
