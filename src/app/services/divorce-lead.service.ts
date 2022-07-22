import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map} from 'rxjs/operators';
import {IGridDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';
import {IApiResponseBody} from '../models/api-response-body';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../models/server-dropdown';
import {IDivorceLead} from '../models/divorce-lead';

@Injectable({
    providedIn: 'root'
})
export class DivorceLeadService {

    static adapt(task): IDivorceLead {
        return {
            DocId: task.DocId,
        };
    }

    constructor(private api: ApiService) {
    }

    create(task: Partial<IDivorceLead>) {
        return this.api.post({endpoint: `/divorce-lead/new`, body: task, useAuthUrl: true})
            .pipe(
                map(res => res as IApiResponseBody),
                map((res: IApiResponseBody) => {
                    res.Data = DivorceLeadService.adapt(res.Data);
                    return res;
                })
            );
    }

    getAll(params?: IGridDataFetcherParams) {
        return this.api.get({
            endpoint: `/leads/divorces`,
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.city && {city: params.city.join(',')}),
            },
            useAuthUrl: false,
        }).pipe(
            map(res => res as IApiResponseBody),
            /*map((res: IApiResponseBody) => {
                res.Data = res.Data && res.Data.map(lead => {
                    return DivorceLeadService.adapt(lead);
                });
                // console.log(res.Data);
                return res;
            }),*/
        );
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/leads/divorces/${DocId}`, useAuthUrl: true}).pipe(
            map(res => res as IApiResponseBody),
            map((res: IApiResponseBody) => DivorceLeadService.adapt(res.Data[0])),
        );
    }

    update(param: { DocId: string; formData: IDivorceLead }) {
        return this.api.post({endpoint: `/task/update/${param.DocId}`, body: param.formData, useAuthUrl: true});
    }

    cityOptions(): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/leads/divorce/city`, useAuthUrl: false})
            .pipe(
                map((res: any) => {
                    return res.Data.map(option => {
                        return {
                            name: `${option.city} ${option.COUNT ? '(' + option.COUNT + ')' : ''}`,
                            value: option.city,
                            selected: option.selected,
                        };
                    })
                }),
            );
    }
}
