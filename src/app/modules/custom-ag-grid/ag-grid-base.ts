import {ColDef, GetRowIdFunc,  GridOptions} from 'ag-grid-community';
import {ContactFilter} from '../../enums/contact-filter.enum';
import {FarmsFilter} from '../../enums/farms-filter.enum';
import {MessageTrackingFilter} from '../../enums/message-tracking-filter.enum';
import {deleteGridAction, editGridAction, IGridAction, viewGridAction} from '../../models/grid';

export type GridExportType = 'csv' | 'excel';

export interface IExportOptions {
    type: GridExportType;
}

export interface IExportableGrid {
    exportOptions: IExportOptions;
}

export class AgGridBase implements IExportableGrid {

    
    private _rowCount: number;
    gridOptions: GridOptions;
    rowData: any[];
    title: string;
    columnDefs: ColDef[];
    sideBar: any;
    theme = 'ag-theme-balham';
    rowSelection = 'multiple';
    rowModelType = 'infinite';
    paginationPageSize = 100;
    cacheOverflowSize = 2;
    maxConcurrentDatasourceRequests = 4;
    infiniteInitialRowCount = 1;
    maxBlocksInCache = 2;
    getRowId: GetRowIdFunc;

    previousRequestParams: any;
    previousDataSubscription: any;
    totalRowCount: number;

    private _exportOptions: IExportOptions = null;
    get exportOptions() {
        return this._exportOptions;
    }

    set exportOptions(exportOptions: IExportOptions) {
        this._exportOptions = exportOptions;
    }

    get rowCount() {
        return this._rowCount;
    }

    set rowCount(rowCount) {
        this._rowCount = rowCount;
    }

    constructor() {
        this.getRowId = function (item) {
            return item.data.DocId;
        };
    }

    get api() {
        return this.gridOptions && this.gridOptions.api;
    }

    get allColumns() {
        return this.gridOptions && this.gridOptions.columnApi && this.gridOptions.columnApi.getAllColumns();
    }

    get visibleColumns() {
        return this.allColumns && this.allColumns.filter(column => column.isVisible());
    }

    get hiddenColumns() {
        return this.allColumns && this.allColumns.filter(column => !column.isVisible());
    }

    get selectedRows() {
        return this.api && this.api.getSelectedRows();
    }

    get selectedRowIds() {
        return this.selectedRows && this.selectedRows.map(row => row.DocId);
    }

    calculateRowCount() {
        if (this.gridOptions && this.gridOptions.api && this.rowData) {
            const model = this.gridOptions.api.getModel();
            const totalRows = this.rowData.length;
            const processedRows = model.getRowCount();
            this.setRowCount(+(processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString()));
        }
    }

    reloadData() {
        this.gridOptions && this.gridOptions.api.purgeServerSideCache();
    }

    setRowCount(rowCount: number) {
        this.rowCount = rowCount;
    }

    get rowsSelected() {
        return this.gridOptions && this.gridOptions.api && this.gridOptions.api.getSelectedRows().length > 0;
    }

    resetExportOptions() {
        this.exportOptions = null;
    }

    onModelUpdated() {
        // console.log('onModelUpdated');
        this.calculateRowCount();
    }

    isExternalFilterPresent() {
        return true;
    }

    doesExternalFilterPass(node) {
        return true;
    }

    addActions<T>(data: T[], actions: IGridAction[] = [viewGridAction, editGridAction, deleteGridAction]) {
        /**
         * TODO: Properly type note in map() callback
         */
        return data && data.length && data.map((item: any) => {
            item.actions = actions;

            return item;

        }) || data;
    }
}

export interface IGridDataFetcherParams {
    perPage?: string | number;
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
    gridGuid?: string;
    // TODO: Sort Order Addon
    sortColumn?: string;
    sortOrder?: string;
    sortModel?: Array<ISortModel>;

}

export interface ISortModel {
    colId?: string;
    sortOrder?: string;
}


export interface IContactDataFetcherParams extends IGridDataFetcherParams {
    [ContactFilter.SEARCH]?: string | number;
    [ContactFilter.TYPE]?: string;
    [ContactFilter.BUCKETS]?: string[];
    [ContactFilter.TAGS]?: string[];
}

export interface IInteractionDataFetcherParams extends IGridDataFetcherParams {
    type?: string;
}

export interface IFarmDataFetcherParams extends IGridDataFetcherParams {
    [FarmsFilter.TRACTS]?: string[];
    cols?: string;
}

export interface IMessageTrackingDataFetcherParams extends IGridDataFetcherParams {
    [MessageTrackingFilter.TRACTS]?: string[];
}

export interface IGridDataFetcher {
    getAll(params: IGridDataFetcherParams);
}

export interface IGridColumnDataFetcherParams extends IGridDataFetcherParams {
    [FarmsFilter.TRACTS]?: string[];
    cols?: string;
}
