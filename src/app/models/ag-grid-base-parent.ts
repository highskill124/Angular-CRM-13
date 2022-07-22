import {IGridColumnAgGrid} from './grid-column';
import {IGridDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';
import {ColDef} from 'ag-grid-community';
import {GridDataFetcherFactoryFunc} from '../types/grid-data-fetcher-factory-func';

export interface IAgGridBaseParent {
    gridGuid: string;
    columnsList: IGridColumnAgGrid[];
    supplementaryColumnDefs?: ColDef[];
    dataFetcherFactory: GridDataFetcherFactoryFunc;

    fetchColumnsList: (gridGuid: string) => void;
    createColumnDefs?: (columnsList: IGridColumnAgGrid[]) => void;
    setDataFetcherFactory: (fetcherParams?: IGridDataFetcherParams) => void;
}
