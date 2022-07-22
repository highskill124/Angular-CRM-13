import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { IServerDropdownOption, ServerDropdownOption } from '../models';


@Injectable({
  providedIn: 'root'
})
export class DemoDataService {


  constructor(private api: ApiService) { }

    getMatGridLayout(guid: string): Observable<any[]> {
        return this.api.basicget(`/demo/column/${guid}`)
            .pipe(
                map((res: any) => {
                    console.log(res);
                    return res.Data
                    })
            );
    }

    getAll(params?: IGridDataFetcherParams) : Observable<IApiResponseBody> {
        return this.api.get({
            endpoint: `/demo/contacts`,
            params: {
                rowCount: params.rowCount,
                offset: params.offset
                    },
            useAuthUrl: false,
        }).pipe(
            tap(res => console.log(res)),
            map(res => res as IApiResponseBody),
            
        );
    }

    getMatGridData(guid: string): Observable<any[]> {
        return this.api.basicget(`/demo/data/${guid}`)
            .pipe(
                map((res: any) => {
                    console.log(res);
                    return res.Data
                    })
            );
    }

    getSelectOptionData(endpoint: string): Observable<any[]> {
        return this.api.customGet(endpoint)
            .pipe(
                map((res: any) => {
                    console.log('selectOptionData', res);
                    let maskedData:IServerDropdownOption[] =[];
                    if(typeof res.Data[0] == 'string') {
                        res.Data.forEach(element => { maskedData.push( { name: element, value: element })});
                    } else if(typeof res.Data[0] == 'object' && res.Data[0].name) {
                        maskedData = res.Data;
                    }
                    return maskedData
                })
            );
    }

    getOptions(guid: string): Observable<IServerDropdownOption[]> {
        return this.api.basicget(`/demo/cblookup/${guid}`)
            .pipe(
                map((res: any) => {
                    return res.Data.map(option => {
                        return {
                            name: option.name,
                            value: option.id,
                            selected: option.selected,
                        };
                    })
                }),
            );
    }
}
export interface IGridDataFetcherParams {
    rowCount?: string | number;
    offset?: string | number;
    qsearch?: string | number;
    buckets?: string[];
    doc_group?: string[];
    librarys?: string[];
    tags?: string[];
    type?: string;
    tracts?: string[];
    city?: string[],
    email?: string,
    phone?: string;
    owner?: string;
    qstype?: string;
    qtypeText?: string;
    update?: string;
}

export interface IApiResponseBody<T = any> {
    Error?: boolean;
    Message?: string;
    RowsAffected?: number;
    Success?: boolean;
    Data?: T;
    RowCount?: number;
}