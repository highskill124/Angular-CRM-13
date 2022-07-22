import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map, tap} from 'rxjs/operators';
import {IGridDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';
import {IApiResponseBody} from '../models/api-response-body';
import {IBucket} from '../models/bucket';
import {Observable} from 'rxjs';
import {GridColumnsListGuids} from '../models/grid-columns-list-guids';
import { IServerDropdownOption, ServerDropdownOption } from '../models/server-dropdown';

@Injectable({
    providedIn: 'root'
})
export class BucketService {

    static adapt(bucket): IBucket {
        return {
            id: bucket.id,
            name: bucket.name,
            goal: bucket.number,
            reminder: bucket.reminder,
            days: bucket.days,
            categories: bucket.categories,
        };
    }

    static adaptNew(bucket): IBucket {
        return {
            id: bucket._id,
            name: bucket.text,
            description: bucket.description,
            days: bucket.reminder_interval,
            doc_group: bucket.doc_group,
            sort_order: bucket.sort_order

        };
    }

    constructor(private api: ApiService) {
    }

    create(bucket: Partial<IBucket>) {
        return this.api.post({endpoint: '/addcblookup/bucket', body: bucket, useAuthUrl: true})
            .pipe(
                map(res => res as IApiResponseBody),
                map((res: IApiResponseBody) => {
                    res.Data = BucketService.adapt(res.Data);
                    return res;
                })
            );
    }

    getAll(parentId: string, params?: IGridDataFetcherParams) {
        return this.api.get({
            endpoint: '/buckets',
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.type && {type: params.type}),
            },
            useAuthUrl: true,
        }).pipe(
            map(res => res as IApiResponseBody),
        );
    }

    getAllBuckets(params?: IGridDataFetcherParams) {
       
        return this.api.get({
            endpoint: '/bucketlist',
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                doc_group: params.doc_group?params.doc_group.toString():[],

                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.type && {type: params.type}),
            },
            useAuthUrl: true,
        }).pipe(
            map(res => res as IApiResponseBody),
            //tap(res => console.log(res)),
        );
    }

    getAllAdapted(contactId: string, params?: IGridDataFetcherParams) {
        return this.getAll(contactId, params).pipe(
            map((res: IApiResponseBody) => {
                res.Data = res.Data && res.Data.map(item => {
                    return BucketService.adapt(item);
                });
                // console.log(res.Data);
                return res;
            }),
        );
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/addcblookup/bucket/${DocId}`, useAuthUrl: true}).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res)),
            map((res: IApiResponseBody) => BucketService.adaptNew(res.Data)),
        );
    }

    update(param: { id: string; formData: IBucket }) {
        const formData = {...param.formData, id: param.id};
        return this.api.patch({
            endpoint: `/addcblookup/bucket/${param.id}`,
            body: formData,
            useAuthUrl: true
        });
    }

    bucketList(category: string): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/cblookup/bucket/${category}`, useAuthUrl: true}).pipe(
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

    delete(id: string) {
        return this.api.delete({endpoint: `/addcblookup/bucket/${id}`, useAuthUrl: true});
    }

    fetchExportData(params?: IGridDataFetcherParams): Observable<IApiResponseBody> {

        return this.api.get({
            endpoint: `/exports/${GridColumnsListGuids.BUCKET_GRID}`,
        }).pipe(
            map(res => res as IApiResponseBody),
            map((res: any) => {
                return res;
            }),
        );
    }
}
