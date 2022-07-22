import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GridColumn, GridColumnType} from '../../../models/grid-column';
import {IgGridTableDataService} from '../../../services/ig-grid-table-data.service';
import {IgxCsvExporterService, IgxExcelExporterService, IgxGridComponent, IgxToastComponent, VerticalAlignment } from 'igniteui-angular';
import {GridColumnsService} from '../../../services/grid-columns.service';
import {Router} from '@angular/router';
import {GridAction, IGridInput} from '../../../models/grid';

@Component({
    selector: 'app-ig-grid',
    templateUrl: './ig-grid.component.html',
    styleUrls: ['./ig-grid.component.css'],
})

export class IgGridComponent implements OnInit, AfterViewInit, OnDestroy {

    public remoteData: any;
    @ViewChild('grid') public grid: IgxGridComponent;
    @ViewChild('toast') public toast: IgxToastComponent;
    private _prevRequest: any;
    private _chunkSize: number;

    @Input() gridInput: IGridInput;

    @Input() tableHeaders: GridColumn[];

    columnTypes = GridColumnType;

    allHeaders: GridColumn[];
    pagingConfig = {
        page: 0,
        totalPages: 1,
        perPage: 15,
    };

    perPageItems = [5, 10, 15, 25, 50, 100, 500];

    url = '';
    alive = true;

    constructor(
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private router: Router,
        private _dataService: IgGridTableDataService,
        private _columnsService: GridColumnsService,
        public cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.remoteData = this._dataService.remoteData;
    }

    ngAfterViewInit(): void {
        const filteringExpr = this.grid.filteringExpressionsTree.filteringOperands;
        const sortingExpr = this.grid.sortingExpressions[0];
        // this._chunkSize = parseInt(this.grid.height, 10) / this.grid.rowHeight;
        this._chunkSize = this.grid.perPage;

        this._dataService.getData(
            this.gridInput.gridType.url,
            {
                chunkSize: this.pagingConfig.perPage,
                startIndex: this.pagingConfig.page,
                // startIndex: this.grid.virtualizationState.startIndex,
            },
            filteringExpr,
            sortingExpr,
            (data) => {
                console.log('data ', data);
                this.grid.totalItemCount = data.Count;
                this.pagingConfig.totalPages = this.calculateTotalPages(data.Count);
                // this.grid.totalItemCount = this.calculateTotalPages(data.Count);
            });

    }

    public processData($event) {
        // console.log('event passed ', $event);
        if (this._prevRequest) {
            this._prevRequest.unsubscribe();
        }

          // TODO: Moved Message to Open and changed show to open as well as fixed Position 
        this.toast.positionSettings.verticalDirection = VerticalAlignment.Bottom;
        this.toast.displayTime = 1000;
        this.toast.open('Loading Remote Data...');
        this.cdr.detectChanges();

        const virtualizationState = this.grid.virtualizationState;
        const filteringExpr = this.grid.filteringExpressionsTree.filteringOperands;
        const sortingExpr = this.grid.sortingExpressions[0];
        console.log('virtualization state ', virtualizationState);

        this._prevRequest = this._dataService.getData(
            this.gridInput.gridType.url,
            {
                chunkSize: this.pagingConfig.perPage,
                startIndex: this.pagingConfig.page,
                // startIndex: virtualizationState.startIndex
            },
            filteringExpr,
            sortingExpr,
            (data) => {
                // console.log('filtered count ', data.filteredCount, ' data ', data);
                // this.grid.totalItemCount = this.calculateTotalPages(data.filteredCount);
                this.grid.totalItemCount = data.filteredCount;
                this.pagingConfig.totalPages = this.calculateTotalPages(data.filteredCount);
                this.toast.close();
                this.cdr.detectChanges();
            });
    }

    private calculateTotalPages(itemsCount: number) {
        const totalPages = Math.ceil(itemsCount / this.pagingConfig.perPage);
        setTimeout(() => {
            console.log('items count ', itemsCount, ' chunk size ', this._chunkSize, ' total pages ', totalPages);
        });
        return totalPages;
    }

    editRow(rowIndex) {
        const editAction = this.gridInput.actions.find(action => action.action === GridAction.EDIT);
        if (editAction && editAction.action) {
            const row = this.grid.getRowByIndex(rowIndex);
            console.log('row data ', row);
            this.router.navigate([editAction.url, row.data[editAction.idField]]);
        }
    }

    get isFirstPage() {
        return this.pagingConfig.page === 0;
    }

    get isLastPage() {
        return this.pagingConfig.page + 1 >= this.pagingConfig.totalPages;
    }

    updatePerPage($event) {
        if (+$event.target.value < 0) {
            return;
        }
        this.pagingConfig.perPage = $event.target.value;
        this.processData({});
    }

    previousPage() {
        if (!this.isFirstPage) {
            this.pagingConfig.page = this.pagingConfig.page - 1;
        }
        this.processData({});
    }

    nextPage() {
        if (!this.isLastPage) {
            this.pagingConfig.page = this.pagingConfig.page + 1;
        }
        this.processData({});
    }

    paginate(index: number) {
        this.pagingConfig.page = index;
        this.processData({});
    }

    ngOnDestroy() {
        if (this._prevRequest) {
            this._prevRequest.unsubscribe();
        }
        this.alive = false;
    }

    toggleColumn($event) {
        const columnName = $event.column.field;
        /**
         * if $event.newValue is true, set visibility to false since true means
         * the column has been hidden on the grid
         */
        const columnVisibility: boolean = !$event.newValue;
        this.tableHeaders.forEach(header => {
            if (header.column_name === columnName) {
                this._columnsService.toggleColumnVisibility(header.guid, columnVisibility).subscribe();
            }
        });
    }
}
