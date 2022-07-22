import {IGridDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';

export interface IGridReloadPayload {
    /**
     * currentDataFetcherParams represents the filter parameters currently set on the grid.
     * They can help in restoring the filter state of the grid after it has been reloaded
     */
    currentDataFetcherParams?: IGridDataFetcherParams;
}
