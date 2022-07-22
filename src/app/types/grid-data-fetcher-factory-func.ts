import {IServerSideGetRowsParams} from 'ag-grid-community';
import {Observable} from 'rxjs';
import {IGridDataFetcherResult} from '../models/grid-data-fetcher-result';

/**
 * Function that takes in IServerSideGetRowsParams and any number of arguments.
 * Returns an Observable of type IGridDataFetcherResult
 */
export type GridDataFetcherFactoryFunc = (params: IServerSideGetRowsParams, ...args: any[]) => Observable<IGridDataFetcherResult>;
