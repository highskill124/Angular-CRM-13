import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GridColumn, GridColumnType} from '../../../models/grid-column';
import {IgxCsvExporterService, IgxExcelExporterService, IgxGridComponent, IgxToastComponent, VerticalAlignment } from 'igniteui-angular';
import {GridColumnsService} from '../../../services/grid-columns.service';
import {Router} from '@angular/router';
import {GridAction, IGridInput} from '../../../models/grid';
import {IgGridTestTableDataService} from '../../../views/farms/components/farm-lists-test/ig-grid-test-table-data.service';

@Component({
    selector: 'app-ig-grid-test',
    templateUrl: './ig-grid-test.component.html',
    styleUrls: ['./ig-grid-test.component.css'],
})

export class IgGridTestComponent implements OnInit, AfterViewInit, OnDestroy {

    public remoteData: any;
    @ViewChild('grid') public grid: IgxGridComponent;
    @ViewChild('toast') public toast: IgxToastComponent;
    private _prevRequest: any;
    private _chunkSize: number;

    @Input() gridInput: IGridInput;

    @Input() tableHeaders: GridColumn[];

    columnTypes = GridColumnType;

    allHeaders: GridColumn[];

    url = '';
    alive = true;

    constructor(
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private router: Router,
        private _dataService: IgGridTestTableDataService,
        private _columnsService: GridColumnsService,
        public cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.remoteData = this._dataService.remoteData;
    }

    ngAfterViewInit(): void {
        const filteringExpr = this.grid.filteringExpressionsTree.filteringOperands;
        const sortingExpr = this.grid.sortingExpressions[0];
        this._chunkSize = parseInt(this.grid.height, 10) / this.grid.rowHeight;

        this._dataService.getData(
            this.gridInput.gridType.url,
            {
                chunkSize: this._chunkSize,
                startIndex: this.grid.virtualizationState.startIndex || 0
            },
            filteringExpr,
            sortingExpr,
            true,
            (data) => {
                this.grid.totalItemCount = data.Count;
            });

    }

    public processData($event, reset = false) {
        setTimeout(() => {
            console.log('event passed ', $event);
        });
        if (this._prevRequest) {
            this._prevRequest.unsubscribe();
        }
        // TODO: Moved Message to Open and changed show to open as well as fixed Position 
        // this.toast.message = 'Loading Remote Data...';
        // this.toast.position = 1;
        this.toast.positionSettings.verticalDirection = VerticalAlignment.Bottom;
        this.toast.displayTime = 1000;
        this.toast.open('Loading Remote Data...');
        this.cdr.detectChanges();

        const virtualizationState = this.grid.virtualizationState;
        const filteringExpr = this.grid.filteringExpressionsTree.filteringOperands;
        const sortingExpr = this.grid.sortingExpressions[0];

        this._prevRequest = this._dataService.getData(
            this.gridInput.gridType.url,
            {
                chunkSize: this._chunkSize,
                startIndex: virtualizationState.startIndex
            },
            filteringExpr,
            sortingExpr,
            reset,
            (data) => {
                // this.grid.totalItemCount = data.Count;
                this.toast.close();
                this.cdr.detectChanges();
            });
    }

    editRow(rowIndex) {
        const editAction = this.gridInput.actions.find(action => action.action === GridAction.EDIT);
        if (editAction && editAction.action) {
            const row = this.grid.getRowByIndex(rowIndex);
            console.log('row data ', row);
            this.router.navigate([editAction.url, row.data[editAction.idField]]);
        }
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
