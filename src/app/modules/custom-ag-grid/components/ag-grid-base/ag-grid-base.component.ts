import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {catchError, takeWhile} from 'rxjs/operators';
import {
    ColDef,
    ColumnMovedEvent,
    ColumnResizedEvent,
    GridOptions,
    IServerSideDatasource,
    IServerSideGetRowsParams
} from 'ag-grid-community';
import {IGridColumnAgGrid} from '../../../../models/grid-column';
import {GridColumnsService} from '../../../../services/grid-columns.service';
import {selectedGridPageSize} from '../../../../models/grid-page-sizes';
import {AgGridBase, GridExportType, IGridDataFetcherParams} from '../../ag-grid-base';
import {throwError} from 'rxjs';
import {IAgGridSearchFilterResult, OnSearchFilter} from '../ag-grid-search-filter/ag-grid-search-filter.component';
import {GridDataFetcherFactoryFunc} from '../../../../types/grid-data-fetcher-factory-func';
import {IGridDataFetcherResult} from '../../../../models/grid-data-fetcher-result';
import {DateAndTimeRenderer, DateRenderer, StringRenderer} from '../../render-functions/date-renderer';
import {CurrencyPipe} from '@angular/common';
import {MultiKeyValueItemRendererComponent} from '../multi-key-value-item-renderer/multi-key-value-item-renderer.component';
import {EmailsTooltipRenderer, FollowupInfo} from '../../render-functions/tooltip-renderers';
import {IGridReloadPayload} from '../../../../models/grid-reload-payload';
import {DataExportService} from '../../../../services/data-export.service';
import {AgGridAngular} from 'ag-grid-angular';
import {TemplateRendererComponent} from '../template-renderer/template-renderer.component';
import {hexToRgb} from '../../../../helpers/utils';
import {CustomTooltip} from '../basic-tooltip/basic-tooltip.component';
import {GridFiltersService} from '../../../../services/grid-filters.service';
import { minDate } from '@rxweb/reactive-form-validators';

@Component({
    selector: 'app-ag-grid-base',
    templateUrl: './ag-grid-base.component.html',
    styleUrls: ['./ag-grid-base.component.scss'],
})
export class AgGridBaseComponent extends AgGridBase implements OnInit, OnDestroy{

    private dataFetcherParams: IGridDataFetcherParams = {};
    gridColumnDefs: ColDef[];
    alive = true;
    @Input() BaseRowClassRules;
    @Input() rowModelType = 'serverSide';

    @Input() isInfiniteScrollGrid = false;
    /**
     * Must be available when isInfiniteScrollGrid === true
     */
    @Input() cacheBlockSizeInfiniteScroll = 100;
    @Input() infiniteInitialRowCount = 100;
    selectedIds: Array<any> = [];

    @Input() cacheBlockSize = selectedGridPageSize;
    @Input() pagination = true;
    @Input() paginationAutoPageSize = false;
    @Input() paginationPageSize = selectedGridPageSize;
    @Input() suppressRowClickSelection = false;
    @Input() enableRangeSelection = false;
    // @Input() rowDeselection = true; // Removed in V24 of AG Grid
    @Input() supplementaryColumnDefs: ColDef[];
    @Input() dataFetcherFactory: GridDataFetcherFactoryFunc;
    @Input() serverSideStoreType = 'partial';

    @Input() gridGuid: string;
    @Input() gridHeight: string;
    @Input() gridWidth = '100%';
    @Input() sideBar: boolean | Object;
    @Input() theme = 'ag-theme-material';
    @Input() columnsList: IGridColumnAgGrid[];
    @Input() searchFilter: any;


    @Output() onRowClickAction = new EventEmitter<any>();
    @Output() onViewAction = new EventEmitter<any>();
    @Output() onEditAction = new EventEmitter<{ DocId }>();
    @Output() onDeleteAction = new EventEmitter<{ DocId: string | string[] }>();
    @Output() onGridReload = new EventEmitter<IGridReloadPayload>();
    @Output() onGridReady = new EventEmitter<GridOptions>();
    @Output() onGridLoaded = new EventEmitter<GridOptions>();
    @Output() onGridDataLoaded = new EventEmitter<boolean>();
    @Output() onBaseFirstDataRendered = new EventEmitter<GridOptions>();
    @Output() searchFilterChange: EventEmitter<any> = new EventEmitter();
    @ViewChild('gridInstance', {read: AgGridAngular})
    public gridInstance: AgGridAngular;

    @ViewChild('agGridContainer') public agGridContainer: ElementRef;
    @Input() notifyTemp: TemplateRef<any>;
    @Input() progressBG: string;
    @Input() DocId: string;

    @Input() rowIndex: number;
    @Input() showCheckBox = false




    private progressBGDefault = '#70cc70';

    constructor(
        private cdRef: ChangeDetectorRef,
        private columnsService: GridColumnsService,
        private dataExportService: DataExportService,
        private currencyPipe: CurrencyPipe,
        private gridFilterService: GridFiltersService
    ) {
        super();
    }

    onFirstDataRendered(event) {
        // debugger
        this.onBaseFirstDataRendered.emit(event);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.createColumnDefs();
        }, 500);
    }

    ngOnInit() {

        this.gridOptions = <GridOptions>{
            context: {
                componentParent: this,
            },
            defaultColDef: {
                resizable: true,
                sortable: true,
                tooltipComponent: 'customTooltip',
                //cellClass: 'ui-grid-vcenter',
                suppressMenu : true
            },
            /**
             * @see https://github.com/ag-grid/ag-grid-angular/issues/121
             */
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this)
        };


        const filterResult = this.gridFilterService.getPreviousFilter(this.gridGuid)


        // setTimeout(() => {
        //     console.log('Stared Actual Query');
        //     this.applyPreviousFilter(filterResult)
        // }, 5000)

        const gridFilters = JSON.parse(localStorage.getItem('gridFilters'));
        // if (gridFilters) {
        //     console.log('AG Grid Base Apply Quick Filters')
        //     let activeFilters: any = gridFilters.find(x => x.gridGuid === this.gridGuid)
        //     if (!activeFilters) {
        //         activeFilters = {};
        //     }
        //     if (activeFilters && activeFilters.qstype && activeFilters.qsearch && activeFilters.qtypeText) {
        //         this.onSearchFilterChanged({
        //             newValue: activeFilters.qsearch,
        //             qstype: activeFilters.qstype,
        //             qtypeText: activeFilters.qtypeText
        //         });
        //     }
        // }


        // ===================Get Localstorage====================================

    }

    public onReady($event) {
        this.gridOptions = {
            ...this.gridOptions,
            ...$event,
        };


        // this.calculateRowCount();
        this.onGridReady.emit(this.gridOptions);
        // this.setDataSource(() => {
        //     this.onGridLoaded.emit(this.gridOptions);
        // });
        // this.setDataSource()

    }

    /**
     * Apply search filter
     * search filter component, exposes OnSearchFilter interface which base grid implements
     * @param filterResult
     */



    applyPreviousFilter(filterResult: IAgGridSearchFilterResult) {
        this.updateDataFetcherParam('qsearch', filterResult.qsearch);


        // this.updateDataFetcherParam('qsearch', filterResult.newValue);

        this.updateDataFetcherParam('qstype', filterResult.qstype);
        this.updateDataFetcherParam('qtypeText', filterResult.qtypeText);

        this.onGridReload.emit(
            {currentDataFetcherParams: {qsearch: filterResult.qsearch, qstype: filterResult.qstype, qtypeText: filterResult.qtypeText}}
        )
    }

    // onSearchFilterChanged(filterResult: IAgGridSearchFilterResult) {
    //     console.log('Update Filter ag base')

    //     this.updateDataFetcherParam('qsearch', filterResult.newValue);
    //     this.updateDataFetcherParam('qstype', filterResult.qstype);
    //     this.updateDataFetcherParam('qtypeText', filterResult.qtypeText);

    //     this.gridFilterService.updateFilter(filterResult, this.gridGuid)

    //     // ===================Update Localstorage====================================
    //     // this.searchFilterChange.emit({ qsearch: filterResult.newValue, qstype: filterResult.qstype })
    //     this.onGridReload.emit(
    //         {currentDataFetcherParams: {qsearch: filterResult.newValue, qstype: filterResult.qstype, qtypeText: filterResult.qtypeText}}
    //     )
    //     // this.setDataSource();
    // }

    updateDataFetcherParam(optionName: keyof IGridDataFetcherParams, optionValue: any) {
        this.dataFetcherParams[optionName] = optionValue;
    }

    getDataFetcherParams() {
        return this.dataFetcherParams;
    }

    reloadData() {
        this.onGridReload.emit({currentDataFetcherParams: {...this.getDataFetcherParams()}});
    }

    private createColumnDefs(columnsList: IGridColumnAgGrid[] = this.columnsList) {
        this.gridColumnDefs = columnsList.map((column) => {
            const showCheckbBox = this.showCheckBox
            const passedInDefinitionForColumn = this.supplementaryColumnDefs && this.supplementaryColumnDefs
                .find((supColDef) => {
                    // First compare by colId if the two column definitions have it
                    if (column.colId && supColDef.colId) {
                        return column.colId === supColDef.colId;
                    }
                    // then by field if the two column definitions have it
                    if (column.field && supColDef.field) {
                        return column.field === supColDef.field;
                    }
                    // finally compare by headerName if all above did not pass
                    if (column.headerName && supColDef.headerName) {
                        return column.headerName === supColDef.headerName;
                    }
                });
                

            return {
                colId: column.colId,
                headerName: column.headerName,
                field: column.field,
                hide: column.hide,
                sortable: column.sortable,
                width: column.width,
                filter: true,
                cellStyle: {
                    'background-color': '',
                    'font-size': '13px',
                    
                    
                },


                checkboxSelection: function (params) {
                    if(showCheckbBox === true){
                    const displayedColumns = params.columnApi.getAllDisplayedColumns();
                    return displayedColumns[0] === params.column;
                    }
                },
                // headerCheckboxSelection: function (params) {
                //     const displayedColumns = params.columnApi.getAllDisplayedColumns();
                //     // console.log(displayedColumns[0] === params.column);
                //     return displayedColumns[0] === params.column;
                // },
                headerCheckboxSelectionFilteredOnly: true,
                ...(column.type && {
                    ...(Array.isArray(column.type)
                        ? this.resolveRenderers(column.type, column)
                        : this.resolveRenderer(column.type, column)),
                }),

                // add column definition for this particular column that was passed in
                ...(passedInDefinitionForColumn),
            };
        });

        const actionsColumn = this.supplementaryColumnDefs && this.supplementaryColumnDefs
            .find(column => column.headerName === 'Actions');
        if (actionsColumn) {
            const actions = (actionsColumn as any).actions;
            const actionCount = (actions && actions.length) || 0;

            this.gridColumnDefs = [
                ...this.gridColumnDefs,
                {
                    ...actionsColumn,
                    resizable: false,
                    suppressMovable: true,
                    lockVisible: true,
                    lockPinned: true,
                    cellStyle: {
                        'background-color': '',
                        'font-size': '25px',
                        'padding': '0',
                        'text-align': 'center',
                    },
                    width: 45 * actionCount,
                },
            ];
        }
    }

    resolveRenderers(types: string[], column: IGridColumnAgGrid) {
        // TODO: flesh out
        return this.resolveRenderer(types[0], column);
    }

    resolveRenderer(type: string, column: IGridColumnAgGrid) {
        switch (type) {
            case 'msgtrack':
                return {
                    cellRenderer: (data) => {
                        return data.data.msg_count + ' | ' + data.data.click_count;
                    },
                };

            // case 'test':
            //     return {
            //         cellRenderer: (data) => {
            //             console.log(data.value)
            //             return data.value[0];                        },
            //     };


            case 'date':
                return {
                    cellRenderer: (data) => {
                        return DateRenderer(data.value);
                    },
                };
            case 'datetime':
                return {
                    cellRenderer: (data) => {
                        return DateAndTimeRenderer(data.value);
                    },
                };
            case 'money':
                return {
                    cellRenderer: (data) => {
                        return data.value && this.currencyPipe.transform(data.value, 'USD');
                    },
                };
            case 'updateFlag':
                return {
                    cellRenderer: (data) => {
                        if (data.value === true) {
                            return '<span><i class="material-icons md-18" style="color:red;vertical-align: middle">edit</i></span>';
                        } else {
                            return '<span></span>';
                        }
                    },
                };
            case 'checkedFlag':
                return {
                    cellRenderer: (data) => {
                        if (data.value === true) {
                            return '<span class="table-row-icon"><i class="material-icons md-18" style="color:green">done</i></span>';
                        } else {
                            return '<span></span>';
                        }
                    },
                };

            case 'mls2' : {
                return {
                    cellRendererFramework: TemplateRendererComponent,
                    cellRendererParams: {
                        ngTemplate: this.notifyTemp,
                        tooltipRenderer: CustomTooltip,
                    },
                }
            }
                ;


            case 'checkedFollowup':
                return {
                    cellRenderer: (data) => {
                        if (data.value && data.value !== '') {
                            return '<span class="table-row-icon"><i class="material-icons md-18" style="color:green">done</i></span>';
                        } else {
                            return '<span></span>';
                        }
                    },
                };
            case 'followupPrefix':
                return {
                    cellRenderer: (data) => {
                        if (data.value === 'contact') {
                            return '<span class="table-row-icon"><i class="material-icons md-18" style="color:green">person</i></span>';
                        } else {
                            return '<span></span>';
                        }
                    },
                };
            case 'multi-keyvalue':
                return {
                    cellRendererFramework: MultiKeyValueItemRendererComponent,
                    cellRendererParams: {
                        field: column.field,
                        tooltipRenderer: EmailsTooltipRenderer,
                    },
                };
            case 'time-info':
                return {
                    cellRendererFramework: MultiKeyValueItemRendererComponent,
                    cellRendererParams: {
                        field: column.field,
                        tooltipRenderer: FollowupInfo,
                    },
                };
            case 'notify' :
                return {
                    cellRendererFramework: TemplateRendererComponent,
                    cellRendererParams: {
                        ngTemplate: this.notifyTemp,

                    }
                };

            case 'mls' :
                return {
                    cellRendererFramework: TemplateRendererComponent,
                    cellRendererParams: {
                        ngTemplate: this.notifyTemp,
                        tooltipRenderer: FollowupInfo,

                    }
                };

            case 'progress' :
                return {
                    cellRenderer: (data) => {

                        const progress = data.value;
                        const rgbC = hexToRgb(this.progressBG || this.progressBGDefault);
                        const htmlString = `
                                <div class="cut-progress progress">
                                    <i>${progress.toFixed(2)}%</i>
                                    <div class="progress-bar" role="progressbar"
                                        style="width: ${progress}%; background: rgba(${rgbC.r}, ${rgbC.g}, ${rgbC.b},${progress / 100});" aria-valuenow="${progress}"
                                        aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                            `;

                        return htmlString;
                    }
                }
        }

    }

    independentExport<T = any>(params: {
        export_data: Array<T>,
        export_def?: ColDef[],
        exportFormat: GridExportType,
        fileName?: string,
    }) {
        this.dataExportService.handleExport<T>({
            export_data: params.export_data,
            exportFormat: params.exportFormat,
            export_def: params.export_def,
            fileName: params.fileName,
        });
    }

    onExport(format: GridExportType) {
        const paginationPageSize = this.api.paginationGetPageSize();

        // update export options
        this.exportOptions = {type: format};

        // update offset and perPage in current grid data fetcher params
        this.updateDataFetcherParam('offset', 0);
        this.updateDataFetcherParam('perPage', paginationPageSize);
        this.cacheBlockSize = paginationPageSize;
        this.api.redrawRows();
        this.setDataSource(() => {
            switch (this.exportOptions.type) {
                case 'csv':
                    this.api && this.api.exportDataAsCsv();
                    this.resetExportOptions();
                    // this.setDataSource();
                    break;

                case 'excel':
                    this.api && this.api.exportDataAsExcel();
                    this.resetExportOptions();
                    // this.setDataSource();
                    break;
            }
        });
    }

    setDataSource( callback?: () => void) {
        const _that = this;
        const dataSource: IServerSideDatasource = {
            getRows: (params: IServerSideGetRowsParams) => {
                
                _that.previousRequestParams = params;
                setTimeout(() => {
                    // Comment this out since it prevents grid from making multiple data requests at a time
                    /*if (_that.previousDataSubscription) {
                        _that.previousDataSubscription.unsubscribe();
                    }*/
                    _that.previousDataSubscription = _that.dataFetcherFactory(params)
                        .pipe(
                            takeWhile(_ => _that.alive),
                            catchError(err => {
                                // turn off export mode
                                _that.resetExportOptions();
                                return throwError(err);
                            }),
                        )
                        .subscribe((res: IGridDataFetcherResult) => {
                            _that.totalRowCount = res.totalRowCount;
                            params.successCallback(res.rowsThisPage, res.totalRowCount);
                            this.onGridDataLoaded.emit(true);
                            // Highlight Selected Row
                            this.gridOptions.api.forEachNode(node=>{
                                if(this.DocId === node.id){
                                    node.setSelected(true);
                                }
                              })

                              if(this.rowIndex){
                                this.gridOptions.api.ensureIndexVisible(this.rowIndex, "middle")
                            }

                           

                            if (callback) {
                                callback();

                            }
                        });

                }, 500);
            }
        };
        this.gridOptions.api.setServerSideDatasource(dataSource);


    }

    get selectedRowIds() {
        return this.selectedRows && this.selectedRows.map(row => row.DocId);
    }

    selectAllNodes() {
        this.api.forEachNode(function (node) {
            // select the node
            node.setSelected(true);
        });
    }


    clearSelectedNodes() {
        this.api.forEachNode(function (node) {
            // select the node
            node.setSelected(false);
        });
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    private onColumnEvent($event) {
        console.log('onColumnEvent: ', $event);
        switch ($event.type) {
            case 'columnResized':
                if ($event.finished) {
                    this.onColumnResized($event as ColumnResizedEvent);
                }
                break;

            case 'columnMoved':
                this.onColumnMoved($event as ColumnMovedEvent);
        }

    }

    toggleColumnVisibility($event) {
        console.log($event);
        const colId = $event.columns[0].colId;
        // Reverse the selection
        const columnVisibility: boolean = !$event.columns[0].visible;
        const column = this.columnsList.find(col => col.colId === colId);
        if (column) {
            this.columnsService.toggleGridColumnVisibility(this.gridGuid, colId, columnVisibility)
                .pipe(
                    takeWhile(_ => this.alive),
                )
                .subscribe();
        }
    }

    onColumnResized(event: ColumnResizedEvent) {
        //TODO: Fix multiple calls without column
        this.columnsService.setColumnWidth(this.gridGuid, event.column.getColId(), event.column.getActualWidth())
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe();
    }

    onColumnMoved(event: ColumnMovedEvent) {
        this.columnsService.setColumnPosition(this.gridGuid, event.column.getColId(), event.toIndex)
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe();
    }

    onView(params: any) {
        this.onViewAction.emit(params);
    }

    onEdit(DocId: string) {
        this.onEditAction.emit({DocId});
    }

    onDelete(DocId: string | Array<string>) {
        this.onDeleteAction.emit({DocId});
    }

    onPaginationChanged($event: any) {
        // console.log($event);
    }

    changeNotify() {
        console.log('Change Notification')
    }

}
