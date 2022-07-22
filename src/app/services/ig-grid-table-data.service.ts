import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {FilteringLogic, IForOfState, SortingDirection} from 'igniteui-angular';
import {FILTER_OPERATION} from '../enums/filter-operation.enum';

const EMPTY_STRING = '';
const NULL_VALUE = null;

@Injectable({
    providedIn: 'root'
})

export class IgGridTableDataService {

    // public gridData: BehaviorSubject<any[]>;
    public remoteData: Observable<any[]>;
    private _remoteData: BehaviorSubject<any[]>;
    private _cachedData: any[];

    private endpoint: string;

    constructor(private _http: HttpClient) {
        this._remoteData = new BehaviorSubject([]);
        this.remoteData = this._remoteData.asObservable();
    }

    public getData(
        endpoint: string,
        virtualizationArgs?: IForOfState,
        filteringArgs?: any,
        sortingArgs?: any, cb?: (any) => void): any {
        // console.log('args virt ', virtualizationArgs);
        this.endpoint = endpoint;
        return this._http.post(this.buildDataUrl('', filteringArgs, sortingArgs), {})
            .pipe(
                map((res: any) => {
                    console.log(res.Data[0])
                    return {Results: res.Data[0], Count: res.Data[1][0].Row_Count};
                })
            )
            .subscribe((filteredData: any) => {
                // console.log('first result ', filteredData);
                let filteredCount = filteredData.Results.length;
                this._http.post(this.buildDataUrl(virtualizationArgs, filteringArgs, sortingArgs), {})
                    .pipe(
                        tap((res: any) => {
                            filteredCount = res.Data[1][0].Row_Count;
                        }),
                        map((res: any) => {
                            return {Results: res.Data[0], Count: res.Data[1][0].Row_Count};
                        }),
                    )
                    .subscribe((data: any) => {
                        data.filteredCount = filteredCount;
                        this._remoteData.next(data.Results);
                        if (cb) {
                            cb(data);
                        }
                    });
            });
    }

    private buildDataUrl(virtualizationArgs: any, filteringArgs: any, sortingArgs: any): string {
        let baseQueryString = `${environment.socketUrl}${this.endpoint}?inlinecount=allpages`;
        let scrollingQuery = EMPTY_STRING;
        let orderQuery = EMPTY_STRING;
        let filterQuery = EMPTY_STRING;
        let query = EMPTY_STRING;
        let filter = EMPTY_STRING;

        if (sortingArgs) {
            orderQuery = this._buildSortExpression(sortingArgs);
        }

        if (filteringArgs && filteringArgs.length > 0) {
            console.log('filtering args ', filteringArgs);
            filteringArgs.forEach((columnFilter) => {
                if (filter !== EMPTY_STRING) {
                    filter += ` ${FilteringLogic[FilteringLogic.And].toLowerCase()} `;
                }

                filter += this._buildAdvancedFilterExpression(
                    columnFilter.filteringOperands,
                    columnFilter.operator);
            });

            filterQuery = `$filter=${filter}`;
        }

        if (virtualizationArgs) {
            scrollingQuery = this._buildScrollExpression(virtualizationArgs);
        }

        query += (orderQuery !== EMPTY_STRING) ? `&${orderQuery}` : EMPTY_STRING;
        query += (filterQuery !== EMPTY_STRING) ? `&${filterQuery}` : EMPTY_STRING;
        query += (scrollingQuery !== EMPTY_STRING) ? `&${scrollingQuery}` : EMPTY_STRING;

        baseQueryString += query;

        return baseQueryString;
    }

    private _buildAdvancedFilterExpression(operands, operator): string {
        let filterExpression = EMPTY_STRING;
        operands.forEach((operand) => {
            const value = operand.searchVal;
            const isNumberValue = (typeof (value) === 'number') ? true : false;
            const filterValue = (isNumberValue) ? value : `'${value}'`;
            const fieldName = operand.fieldName;
            let filterString;

            if (filterExpression !== EMPTY_STRING) {
                filterExpression += ` ${FilteringLogic[operator].toLowerCase()} `;
            }

            switch (operand.condition.name) {
                case 'contains': {
                    filterString = `${FILTER_OPERATION.CONTAINS}(${filterValue},${fieldName})`;
                    break;
                }
                case 'startsWith': {
                    filterString = `${FILTER_OPERATION.STARTS_WITH}(${fieldName},${filterValue})`;
                    break;
                }
                case 'endsWith': {
                    filterString = `${FILTER_OPERATION.ENDS_WITH}(${fieldName},${filterValue})`;
                    break;
                }
                case 'equals': {
                    filterString = `${fieldName} ${FILTER_OPERATION.EQUALS} ${filterValue} `;
                    break;
                }
                case 'doesNotEqual': {
                    filterString = `${fieldName} ${FILTER_OPERATION.DOES_NOT_EQUAL} ${filterValue} `;
                    break;
                }
                case 'doesNotContain': {
                    filterString = `${FILTER_OPERATION.DOES_NOT_CONTAIN}(${filterValue}, ${fieldName})`;
                    break;
                }
                case 'greaterThan': {
                    filterString = `${fieldName} ${FILTER_OPERATION.GREATER_THAN} ${filterValue} `;
                    break;
                }
                case 'greaterThanOrEqualTo': {
                    filterString = `${fieldName} ${FILTER_OPERATION.GREATER_THAN_EQUAL} ${filterValue} `;
                    break;
                }
                case 'lessThan': {
                    filterString = `${fieldName} ${FILTER_OPERATION.LESS_THAN} ${filterValue} `;
                    break;
                }
                case 'lessThanOrEqualTo': {
                    filterString = `${fieldName} ${FILTER_OPERATION.LESS_THAN_EQUAL} ${filterValue} `;
                    break;
                }
                case 'empty': {
                    filterString = `length(${fieldName}) ${FILTER_OPERATION.EQUALS} 0`;
                    break;
                }
                case 'notEmpty': {
                    filterString = `length(${fieldName}) ${FILTER_OPERATION.GREATER_THAN} 0`;
                    break;
                }
                case 'null': {
                    filterString = `${fieldName} ${FILTER_OPERATION.EQUALS} ${NULL_VALUE}`;
                    break;
                }
                case 'notNull': {
                    filterString = `${fieldName} ${FILTER_OPERATION.DOES_NOT_EQUAL} ${NULL_VALUE}`;
                    break;
                }
            }

            filterExpression += filterString;
        });

        return filterExpression;
    }

    private _buildSortExpression(sortingArgs): string {
        let sortingDirection: string;
        switch (sortingArgs.dir) {
            case SortingDirection.None: {
                sortingDirection = EMPTY_STRING;
                break;
            }
            default: {
                sortingDirection = SortingDirection[sortingArgs.dir].toLowerCase();
                break;
            }
        }

        return `orderby=${sortingArgs.fieldName}&sortdir=${sortingDirection}`;
    }

    private _buildScrollExpression(virtualizationArgs): string {
        let requiredChunkSize: number;
        const skip = virtualizationArgs.startIndex;
        requiredChunkSize = virtualizationArgs.chunkSize === 0 ? 11 : virtualizationArgs.chunkSize;
        const top = requiredChunkSize;

        return `offset=${skip}&rowcount=${top}`;
    }

}

