import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ApiService} from '../api/api.service';
import {IFarm, IFarmMaster} from '../../models/farm';
import {IFarmDataFetcherParams} from '../../modules/custom-ag-grid/ag-grid-base';
import {IApiResponseBody} from '../../models/api-response-body';
import {IServerDropdownOption} from '../../models/server-dropdown';
import {FarmsFilter} from '../../enums/farms-filter.enum';
import {EMPTY_STRING} from '../../models/empty-string';
import {GridColumnsListGuids} from '../../models/grid-columns-list-guids';

@Injectable({providedIn: 'root'})
export class FarmService {

    static adapt(farm: any): IFarm {
        return {
            name: farm.NAME,
            guid: farm.guid,
            property_count: farm.property_count,
            owner_occupied: farm.owner_occupied,
            absent_occupied: farm.absent_occupied,
        };
    }

    static adaptFarmMaster(farm: any): IFarmMaster {
        return {
            DocId: farm.DocId,
            ...farm,
        };
    }

    sortObject = []

    constructor(public api: ApiService) {
    }

    query(params?: any) {
        return this.api.get({endpoint: '/farming', params: params});
    }

    farmMaster(DocId: string) {
        return this.api.get({endpoint: `/farms/${DocId}`}).pipe(
            map((res: any) => {
                console.log(res.Data);
                // return FarmService.adaptFarmMaster(res.Data);
                return res.Data;
            }),
        );
    }

    farmsList(): Observable<IFarm[]> {
        return this.api.get({endpoint: '/farms/FarmName'}).pipe(
            map((farms: any) => {
                return farms.Data.map(farm => {
                    return FarmService.adapt(farm);
                })
            }),
        );
    }

    processDataFilterParams(params: IFarmDataFetcherParams) {
        let sortObject = this.getSortObject(params)
        return {
            ...(params.qsearch ? {qsearch: params.qsearch} : {}),
            ...(params.cols && {cols: params.cols}),
            ...(params.qstype ? {qstype: params.qstype} : {}),
            ...(params[FarmsFilter.TRACTS] && params[FarmsFilter.TRACTS].length && {[FarmsFilter.TRACTS]: params[FarmsFilter.TRACTS].join(',')}),
            ...(sortObject ? {sort: sortObject}: {}),

           
            /**
             * @Note: params[FarmsFilter.EMAIL] is an array and looks like this {email: []}, same for phone and owner occupied
             * So we check if the very first element in the array is not an empty string, since all three filter types can have only
             * one filter at a time.
             */
            ...(params[FarmsFilter.EMAIL] && !(params[FarmsFilter.EMAIL][0] === EMPTY_STRING) && {[FarmsFilter.EMAIL]: params[FarmsFilter.EMAIL][0]}),
            ...(params[FarmsFilter.PHONE] && !(params[FarmsFilter.PHONE][0] === EMPTY_STRING) && {[FarmsFilter.PHONE]: params[FarmsFilter.PHONE][0]}),
            ...(params[FarmsFilter.OWNER_OCCUPIED] && !(params[FarmsFilter.OWNER_OCCUPIED][0] === EMPTY_STRING) && {[FarmsFilter.OWNER_OCCUPIED]: params[FarmsFilter.OWNER_OCCUPIED][0]}),
            ...(params[FarmsFilter.UPDATE] && !(params[FarmsFilter.UPDATE][0] === EMPTY_STRING) && {[FarmsFilter.UPDATE]: params[FarmsFilter.UPDATE][0]}),
        };
    }

    fetchExportData(params?: IFarmDataFetcherParams): Observable<IApiResponseBody> {
        return this.api.get({
            endpoint: `/exports/${GridColumnsListGuids.FARM_GRID}`,
            params: {
                ...this.processDataFilterParams(params),
            },
        }).pipe(
            map(res => res as IApiResponseBody),
            map((res: any) => {
                /*res.Data = res.Data.map(farm => {
                    farm.emails = farm.emails && farm.emails.length && farm.emails.map((email: any) => {
                        const key = Object.keys(email)[0];
                        return {
                            name: key,
                            value: email[key],
                            selected: true,
                        }
                    }) || farm.emails;

                    farm.phones = farm.phones && farm.phones.length && farm.phones.map((phone: any) => {
                        // const key = Object.keys(phone)[0];
                        return {
                            name: Object.keys(phone)[0],
                            value: Object.values(phone)[0],
                            selected: true,
                        }
                    }) || farm.phones;
                    return farm;
                });*/
                return res;
            }),
        );
    }

    getSortObject(params) {
        let sortObject = []
        if(params.sortModel && params.sortModel.length > 0){
          if(params.sortModel.length === 1){
           sortObject.push(params.sortModel[0].colId + '::' + params.sortModel[0].sort)
          } else {
            params.sortModel.forEach(function (arrayItem) {
            var x = arrayItem.colId + '::' + arrayItem.sort;
            sortObject.push(x)
        });
            
          }
          
          return sortObject
        } else {
          return null
        }
        }

    farmsListGrid(params?: IFarmDataFetcherParams): Observable<IApiResponseBody> {
        // console.log({...((params[FarmsFilter.EMAIL] && !(params[FarmsFilter.EMAIL][0] === EMPTY_STRING)) && {[FarmsFilter.EMAIL]: params[FarmsFilter.EMAIL]})});
       console.log(params)
              return this.api.get({
            endpoint: '/farms/list',
            params: {
                rowcount: params.perPage,
                offset: params.offset,
              
                
            
               
                // sortOrder: params.sortOrder,
                ...this.processDataFilterParams(params),
            },
        }).pipe(
            map(res => res as IApiResponseBody),
            map((res: any) => {
                res.Data = res.Data.map(farm => {
                    farm.emails = farm.emails && farm.emails.length && farm.emails.map((email: any) => {
                        const key = Object.keys(email)[0];
                        return {
                            name: key,
                            value: email[key],
                            selected: true,
                        }
                    }) || farm.emails; 

                    farm.phones = farm.phones && farm.phones.length && farm.phones.map((phone: any) => {
                        // const key = Object.keys(phone)[0];
                        return {
                            name: Object.keys(phone)[0],
                            value: Object.values(phone)[0],
                            selected: true,
                        }
                    }) || farm.phones;
                    return farm;
                });
                console.log(res)
                return res;
            }),
        );
    }

    getAll(): Observable<IFarm[]> {
        return this.api.get({endpoint: '/farming/FarmNames'}).pipe(
            map((farms: any) => {
                return farms.map(farm => {
                    return FarmService.adapt(farm);
                })
            }),
        );
    }

    tractsList(): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: '/tractlist', useAuthUrl: true})
            .pipe(
                map((res: any) => {
                    return res.Data.map(tract => {
                        return {
                            name: tract.name,
                            value: tract.id,
                            selected: tract.selected,
                        }
                    })
                }),
            );
    }

    add(item: IFarm) {
    }

    inteliusUpdate(DocId: string, doc: any) {
        return this.api.post({endpoint: `/farms/bulkemail/${DocId}`, body: doc, useAuthUrl: false}).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    updateOwnerFlag(DocId: string) {
        return this.api.get({endpoint: `/farms/resetOwnerFlag/${DocId}`, useAuthUrl: false}).pipe(
            map((res: any) => {
                return res;
            })
        );

    }

    delete(DocId: string) {
        return this.api.delete({endpoint: `/farm/${DocId}`});
    }

}
