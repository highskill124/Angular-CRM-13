import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { GridOptions } from "ag-grid-community";
// only import this if you are using the ag-Grid-Enterprise
import "ag-grid-enterprise";

import { DateComponent } from "../date-component/date.component";
import { HeaderComponent } from "../header-component/header.component";
import { ApiService } from "../../../../services/api/api.service";
import { takeWhile } from "rxjs/operators";

@Component({
    selector: "app-rich-grid",
    templateUrl: "rich-grid.component.html",
    styleUrls: ["rich-grid.css"],
    encapsulation: ViewEncapsulation.None,
})
export class RichGridComponent implements OnInit, OnDestroy {
    private gridOptions: GridOptions;
    public showGrid: boolean;
    public rowData: any[];
    public rowCount: string;
    @Input() title: string;
    @Input() columnDefs: any[];
    @Input() rowSelection = "multiple";
    @Input() rowModelType = "infinite";
    @Input() paginationPageSize = 100;
    @Input() cacheOverflowSize = 2;
    @Input() maxConcurrentDatasourceRequests = 2;
    @Input() infiniteInitialRowCount = 1;
    @Input() maxBlocksInCache = 2;
    
    @Input() dataUrl: string;

    private alive = true;

    constructor(private api: ApiService) {
        // we pass an empty gridOptions in, so we can grab the api out
        this.gridOptions = <GridOptions>{
            dateComponentFramework: DateComponent,
        };
        this.showGrid = true;
        this.gridOptions.defaultColDef = {
            resizable: true,
            sortable: true,
            filter: true,
            headerComponentFramework: <new () => HeaderComponent>(
                HeaderComponent
            ),
            headerComponentParams: {
                menuIcon: "fa-bars",
            },
        };
    }

    ngOnInit(): void {
        //
    }

    private calculateRowCount() {
        if (this.gridOptions.api && this.rowData) {
            const model = this.gridOptions.api.getModel();
            const totalRows = this.rowData.length;
            const processedRows = model.getRowCount();
            this.rowCount =
                processedRows.toLocaleString() +
                " / " +
                totalRows.toLocaleString();
        }
    }

    private onModelUpdated() {
        console.log("onModelUpdated");
        this.calculateRowCount();
    }

    public onReady($event) {
        console.log("onReady");
        this.calculateRowCount();

        this.api
            .get({ endpoint: `/template/list?rowcount=${this.rowCount}` })
            .pipe(takeWhile((_) => this.alive))
            .subscribe((res: any) => {
                const dataSource = {
                    rowCount: null,
                    getRows: function (params) {
                        console.log(
                            "asking for " +
                                params.startRow +
                                " to " +
                                params.endRow
                        );
                        setTimeout(function () {
                            // let dataAfterSortingAndFiltering = sortAndFilter(res, params.sortModel, params.filterModel);
                            // const rowsThisPage = res.slice(params.startRow, params.endRow);
                            const rowsThisPage = res.Data;
                            let lastRow = -1;
                            if (res.Data.length <= params.endRow) {
                                lastRow = res.Data.length;
                            }
                            params.successCallback(rowsThisPage, lastRow);
                        }, 500);
                    },
                };
                $event.api.setDatasource(dataSource);
            });
    }

    private onCellClicked($event) {
        console.log(
            "onCellClicked: " + $event.rowIndex + " " + $event.colDef.field
        );
    }

    private onCellValueChanged($event) {
        console.log(
            "onCellValueChanged: " + $event.oldValue + " to " + $event.newValue
        );
    }

    private onCellDoubleClicked($event) {
        console.log(
            "onCellDoubleClicked: " +
                $event.rowIndex +
                " " +
                $event.colDef.field
        );
    }

    private onCellContextMenu($event) {
        console.log(
            "onCellContextMenu: " + $event.rowIndex + " " + $event.colDef.field
        );
    }

    private onCellFocused($event) {
        console.log(
            "onCellFocused: (" + $event.rowIndex + "," + $event.colIndex + ")"
        );
    }

    private onRowSelected($event) {
        // taking out, as when we 'select all', it prints to much to the console!!
        // console.log('onRowSelected: ' + $event.node.data.name);
    }

    private onSelectionChanged() {
        console.log("selectionChanged");
    }

    private onBeforeFilterChanged() {
        console.log("beforeFilterChanged");
    }

    private onAfterFilterChanged() {
        console.log("afterFilterChanged");
    }

    private onFilterModified() {
        console.log("onFilterModified");
    }

    private onBeforeSortChanged() {
        console.log("onBeforeSortChanged");
    }

    private onAfterSortChanged() {
        console.log("onAfterSortChanged");
    }

    private onVirtualRowRemoved($event) {
        // because this event gets fired LOTS of times, we don't print it to the
        // console. if you want to see it, just uncomment out this line
        // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
    }

    private onRowClicked($event) {
        console.log("onRowClicked: " + $event.node.data.name);
    }

    public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    private onColumnEvent($event) {
        console.log("onColumnEvent: " + $event);
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    setColumnVisible(column: string, isVisible: boolean) {
        this.gridOptions.columnApi.setColumnVisible(column, isVisible);
    }

    selectAll() {
        this.gridOptions.api.selectAll();
    }

    deselectAll() {
        this.gridOptions.api.deselectAll();
    }
}
