import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IGridDataFetcherParams} from '../../../../modules/custom-ag-grid/ag-grid-base';
import {debounceTime, distinctUntilChanged, map, take, takeWhile, tap} from 'rxjs/operators';
import {ColDef, GridOptions, IServerSideGetRowsParams} from 'ag-grid-community';
import {FarmService} from '../../../../services/farm/farm.service';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {GridColumnsService} from '../../../../services/grid-columns.service';
import {IGridColumnAgGrid} from '../../../../models/grid-column';
import {Observable} from 'rxjs';
import {IApiResponseBody} from '../../../../models/api-response-body';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {FarmsFilter} from '../../../../enums/farms-filter.enum';
import {IAgGridBaseParent} from '../../../../models/ag-grid-base-parent';
import {sidebarColumnsCollapsed} from '../../../../modules/custom-ag-grid/sidebar-configurations/sidebar-columns-collapsed';
import {GridDataFetcherFactoryFunc} from '../../../../types/grid-data-fetcher-factory-func';
import {AgGridBaseComponent} from '../../../../modules/custom-ag-grid/components/ag-grid-base/ag-grid-base.component';
import {addGridActions} from '../../../../helpers/add-grid-actions';
import {viewGridAction} from '../../../../models/grid';
import {ActionsRendererComponent} from '../../../../modules/custom-ag-grid/components/actions-renderer/actions-renderer.component';
import {ActivatedRoute, Router} from '@angular/router';
import {IGridReloadPayload} from '../../../../models/grid-reload-payload';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {EMPTY_STRING} from '../../../../models/empty-string';
import {AgGridSearchFilterComponent} from '../../../../modules/custom-ag-grid/components/ag-grid-search-filter/ag-grid-search-filter.component';
import {IDataExportDialogResult} from '../../../../shared/components/data-export-modal/data-export-dialog.component';
import {phoneFilterOptions} from '../../../../models/filters/phone-filter-options';
import {emailFilterOptions} from '../../../../models/filters/email-filter-options';
import {ownerOccupiedOptions} from '../../../../models/filters/owner-occupied-filter-options';
import {updateFilterOptions} from '../../../../models/filters/update-filter-options';
import {FiltersSidebarContainerComponent} from '../../../../modules/filter/components/filters-sidebar/filters-sidebar-container.component';
import {IActiveFilter} from '../../../../modules/filter/components/filter/filter.component';
import {GridFiltersService} from '../../../../services/grid-filters.service';

@Component({
    selector: 'app-farms-list-ag-grid',
    templateUrl: './farms-list-ag-grid.component.html',
    styleUrls: ['./farms-list-ag-grid.component.scss']
})
export class FarmsListAgGridComponent implements OnInit, AfterViewInit, OnDestroy, IAgGridBaseParent {

    farmsFilters = FarmsFilter;
    activeFilters: IActiveFilter[] = [];
    emptyString = EMPTY_STRING;
    rowClassRules;
    qstypeOptions$: Observable<IServerDropdownOption[]>;
    guids = DropdownGuids;
    sideBar = sidebarColumnsCollapsed;
    alive = true;

    updateFilterOptions = [...updateFilterOptions];
    phoneFilterOptions = [...phoneFilterOptions];
    emailFilterOptions = [...emailFilterOptions];
    ownerOccupiedFilterOptions = [...ownerOccupiedOptions];
    tractsFilterOptions: IServerDropdownOption[] = [];

    gridGuid = GridColumnsListGuids.FARM_GRID;
    columnsList$: Observable<IGridColumnAgGrid[]>;
    columnsList: IGridColumnAgGrid[] = [];
    supplementaryColumnDefs: ColDef[];
    dataFetcherFactory: GridDataFetcherFactoryFunc;

    @ViewChild('filtersSidebarContainer')
    public filtersSidebarContainer: FiltersSidebarContainerComponent;

    @ViewChild('agGridSearchFilter', {read: AgGridSearchFilterComponent})
    public agGridSearchFilter: AgGridSearchFilterComponent;

    @ViewChild('agGridBase', {read: AgGridBaseComponent})
    public agGridBase: AgGridBaseComponent;

    constructor(
        private columnsService: GridColumnsService,
        private farmsService: FarmService,
        private cbLookupService: CouchbaseLookupService,
        private router: Router,
        private gridFilterService: GridFiltersService,
        protected route: ActivatedRoute,
    ) {
        this.fetchColumnsList();
        this.qstypeOptions$ = this.cbLookupService.getOptions(this.guids.QSTYPE_OPTIONS_FARM_LIST);
    }

    ngOnInit() {

        this.setDataFetcherFactory();
        this.farmsService.tractsList()
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe(res => {
                this.tractsFilterOptions = res;
            });
    }

    baseGridReady(gridOptions: GridOptions) {
        this.route.paramMap
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                tap(res => {
                    this.listenForFilterChanges();
                }),
                // read router state from window.history
                map(() => window.history.state),
                tap(state => {

                    let activeFilters: IActiveFilter[];
                    // =========================Get Localstorage===============================
                    let gridFilters: any = JSON.parse(localStorage.getItem('gridFilters'))
                    if (!gridFilters || !gridFilters.length) {
                        gridFilters = [];
                    }
                    const storedFilters: any = gridFilters.find(x => x.gridGuid === this.gridGuid);
                    if (storedFilters && storedFilters.activeFilters) {
                        activeFilters = storedFilters.activeFilters;
                    } else {
                        activeFilters = state.activeFilters;
                    }
                    // =========================Get Localstorage===============================
                    if (activeFilters) {
                        activeFilters.forEach(filter => {
                            if (filter.value) {
                                filter.value.forEach(item => {
                                    this.filtersSidebarContainer.filterComponents.forEach(filterComponent => {
                                        if (filterComponent.group === filter.group) {
                                            filterComponent.filterChanged(item, item.selected);
                                        }
                                    })
                                })
                            }
                        });
                    }
                })
            )
            .subscribe(x => {
            });


    }

    baseGridLoaded(gridOptions: any) {
        setTimeout(() => {
            let gridFilters: any = JSON.parse(localStorage.getItem('gridFilters'))
            if (!gridFilters || !gridFilters.length) {
                gridFilters = [];
            }
            const storedFilters: any = gridFilters.find(x => x.gridGuid === this.gridGuid);
            if (storedFilters && storedFilters.activeFilters) {
                if (storedFilters.rowIndex) {
                    gridOptions.api.ensureIndexVisible(storedFilters.rowIndex, 'middle');
                    setTimeout(() => {
                        gridOptions.api.selectIndex(storedFilters.rowIndex, false, false);
                        storedFilters.rowIndex = 0;
                        this.gridFilterService.setFilter(gridFilters)
                    }, 2000);

                }
            }
        }, 2000);
    }

    ngAfterViewInit(): void {

    }

    searchFilterChanged(data) {


    }

    listenForFilterChanges() {
        this.filtersSidebarContainer.resources
            .pipe(
                takeWhile(_ => this.alive),
                debounceTime(500),
                distinctUntilChanged(),
            )
            .subscribe(filters => {
                this.onSideBarFilter(filters);
            });
    }

    fetchColumnsList(gridGuid = this.gridGuid) {
        this.columnsList$ = this.columnsService.fetchColumnsAgGrid(gridGuid)
            .pipe(
                tap(columnsList => {
                    this.columnsList = columnsList;
                    this.createColumnDefs(columnsList);
                }),
            );
    }

    createColumnDefs(columnsList: IGridColumnAgGrid[] = this.columnsList) {

        this.supplementaryColumnDefs = [
            {
                headerName: 'Actions',
                width: 40,
                sortable: false,
                suppressMenu: true,
                cellRendererFramework: ActionsRendererComponent,
                pinned: 'right',
            },
        ];
    }

    onRowClick(event) {
        console.log(event.rowIndex);
    }

    onView(params: any) {
        // debugger
        let gridFilters = JSON.parse(localStorage.getItem('gridFilters'))
        if (!gridFilters || !gridFilters.length) {
            gridFilters = [];
        }
        let storedFilters: any = gridFilters.find(x => x.gridGuid === this.gridGuid);
        if (!storedFilters) {
            storedFilters = {};
        } else {
            storedFilters.offset = this.agGridBase.previousRequestParams.request.startRow;
            storedFilters.rowIndex = params.rowIndex;
            this.gridFilterService.setFilter(gridFilters)
        }
        const state = {
            activeFilters: this.activeFilters,
            offset: this.agGridBase.previousRequestParams.request.startRow,
            qsearch: storedFilters.qsearch,
            qstype: storedFilters.qstype,
            rowIndex: params.rowIndex
        }

        this.router.navigateByUrl(`/Farm/FarmMaster/${params.data.DocId}`, {
            state,
        });
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    /**
     * Set the data fetcher factory function to be passed into the base grid component
     * @param fetcherParams
     */
    setDataFetcherFactory(fetcherParams?: IGridDataFetcherParams) {
        this.dataFetcherFactory = (params: IServerSideGetRowsParams) => {
            return this.farmsService.farmsListGrid(
                {
                    /**
                     * @note: Prefer fetcherParams if passed in
                     * @note: fetcherParams can be either from the default grid or the export grid,
                     * which is taken into account when setting perPage and offset below
                     */
                    ...this.agGridBase.getDataFetcherParams(),
                    ...(fetcherParams && fetcherParams),
                    perPage: fetcherParams && fetcherParams.perPage ? fetcherParams.perPage : params.request.endRow - params.request.startRow, // endRow - startRow gives perPage value
                    offset: fetcherParams && fetcherParams.offset ? fetcherParams.offset : params.request.startRow,
                    // qsearch: fetcherParams && fetcherParams.qsearch,
                }
            )
                .pipe(
                    map((res: IApiResponseBody) => {
                        const rowsThisPage = addGridActions(res.Data, [viewGridAction]);

                        return {
                            rowsThisPage,
                            totalRowCount: res.RowCount,
                        };
                    }),
                );
        };
    }

    private setActiveFilters(filters: IActiveFilter[]) {

        filters.forEach(filter => {
            const index = this.activeFilters.findIndex((item) => item.group === filter.group);
            if (index !== -1) {
                this.activeFilters[index] = filter;
            } else {
                this.activeFilters.push(filter);
            }
        });
        console.log(this.activeFilters)
    }

    onSideBarFilter(filters: IActiveFilter[]) {

        // Make sure grid has been initialized before trying to update the datasource
        if (this.agGridBase && this.agGridBase.api) {
            this.setActiveFilters(filters);

            // update data fetcher options
            filters.forEach(filter => {
                this.agGridBase.updateDataFetcherParam(<FarmsFilter>filter.group, filter.value.map(filterValue => filterValue.value));
            });

            this.setDataFetcherFactory();
            this.agGridBase.setDataSource();
        }
    }

    activeFilterUpdated(filterType: FarmsFilter, filter: IServerDropdownOption, filterRemoved: boolean) {
        this.filtersSidebarContainer.filterComponents.forEach(filterComponent => {
            if (filterComponent.group === filterType) {
                filterComponent.filterChanged(filter, !filterRemoved);
            }
        })
    }

    resetSelectionSingleOptionFilter(filters: IServerDropdownOption[]) {
        return filters.map(option => {
            option.value === EMPTY_STRING ? option.selected = true : option.selected = false;
            return option;
        });
    }

    onGridReload($event: IGridReloadPayload) {
        this.fetchColumnsList();
        console.log($event.currentDataFetcherParams)
        this.setDataFetcherFactory($event.currentDataFetcherParams);
    }

    onExport($event: IDataExportDialogResult) {
        this.farmsService.fetchExportData({
            ...this.agGridBase.getDataFetcherParams(),
            ...($event.exportAllColumns && {cols: 'all'}),
        })
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
            )
            .subscribe(res => {
                this.agGridBase && this.agGridBase.independentExport({
                    export_data: res.Data.export_data,
                    export_def: res.Data.export_def,
                    exportFormat: $event.exportFormat,
                    fileName: $event.fileName,
                });
            });
    }

    get selectedRowIds(): string[] {
        return this.agGridBase && this.agGridBase.selectedRowIds;
    }
}
