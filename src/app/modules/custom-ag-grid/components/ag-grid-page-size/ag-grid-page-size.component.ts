import {Component, Input, OnInit} from '@angular/core';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {GridApi} from 'ag-grid-community';
import {gridPageSizes, selectedGridPageSize} from '../../../../models/grid-page-sizes';

@Component({
    selector: 'app-ag-grid-page-size',
    templateUrl: './ag-grid-page-size.component.html',
    styleUrls: ['./ag-grid-page-size.component.scss']
})
export class AgGridPageSizeComponent implements OnInit {

    pageSizes: IServerDropdownOption[] = [...gridPageSizes];
    activePageSize = selectedGridPageSize;

    // @Input() parentGridApi: GridApi;

    private _parentGridApi: GridApi;
    @Input() set parentGridApi(parentGridApi: GridApi) {
        this._parentGridApi = parentGridApi;
        this.updatePaginationPageSize(this.activePageSize);
    };

    get parentGridApi() {
        return this._parentGridApi;
    }

    constructor() {
    }

    ngOnInit() {
        this.updatePaginationPageSize(this.activePageSize);
    }

    updatePaginationPageSize($event) {
        if (this.parentGridApi) {
            const pageSize = Number($event);
            /**
             * @see https://github.com/ag-grid/ag-grid/issues/2202#issuecomment-396362879
             */
            // gain access to private object gridOptionsWrapper to forcefully change cacheBlockSize and maxBlocksInCache
            // const gridOptionsWrapper: GridOptionsWrapper = (this.parentGridApi as any).gridOptionsWrapper;
            // gridOptionsWrapper.setProperty('cacheBlockSize', pageSize);
            // gridOptionsWrapper.setProperty('maxBlocksInCache', pageSize);
            // console.log('options wrapper: ', {gridOptionsWrapper});
            this.parentGridApi.purgeServerSideCache();
            this.parentGridApi.paginationSetPageSize(pageSize);
        }
    }

    addTotalRowCountToPageSizes() {
        const totalPages = this.parentGridApi && this.parentGridApi.paginationGetTotalPages(); // wrong: not getting needed data
        if (totalPages) {
            const defaultPageSizes = this.pageSizes.filter(item => {
                return gridPageSizes.findIndex(pageSize => pageSize.value === item.value);
            });

            defaultPageSizes.push({name: totalPages + '', value: totalPages, selected: false});
            console.log(defaultPageSizes, totalPages, this.parentGridApi.paginationGetRowCount());
            this.pageSizes = defaultPageSizes;
        }
    }
}
