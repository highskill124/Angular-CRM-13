import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { IGridDataFetcherParams } from '../../../../modules/custom-ag-grid/ag-grid-base';
import { debounceTime, distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { IServerSideGetRowsParams } from 'ag-grid-community';
import { IGridColumnAgGrid } from '../../../../models/grid-column';
import { Observable, Subscription } from 'rxjs';
import { IApiResponseBody } from '../../../../models/api-response-body';
import { IServerDropdownOption } from '../../../../models/server-dropdown';
import { FarmsFilter } from '../../../../enums/farms-filter.enum';
import { IAgGridBaseParent } from '../../../../models/ag-grid-base-parent';
import { sidebarColumnsCollapsed } from '../../../../modules/custom-ag-grid/sidebar-configurations/sidebar-columns-collapsed';
import { GridDataFetcherFactoryFunc } from '../../../../types/grid-data-fetcher-factory-func';
import { AgGridBaseComponent } from '../../../../modules/custom-ag-grid/components/ag-grid-base/ag-grid-base.component';
import { addGridActions } from '../../../../helpers/add-grid-actions';
import { viewGridAction } from '../../../../models/grid';
import {ToasterService} from 'angular2-toaster';
import { IGridReloadPayload } from '../../../../models/grid-reload-payload';
import { EMPTY_STRING } from '../../../../models/empty-string';
// tslint:disable-next-line:max-line-length
import { AgGridSearchFilterComponent, IAgGridSearchFilterResult, OnSearchFilter } from '../../../../modules/custom-ag-grid/components/ag-grid-search-filter/ag-grid-search-filter.component';
import { IDataExportDialogResult } from '../../../../shared/components/data-export-modal/data-export-dialog.component';
// tslint:disable-next-line:max-line-length
import { FiltersSidebarContainerComponent } from '../../../../modules/filter/components/filters-sidebar/filters-sidebar-container.component';
import { IActiveFilter } from '../../../../modules/filter/components/filter/filter.component';
import { FilterSetting } from '../../model/filter-setting.model';
import { FilterGridService } from '../../service/filter-grid.service';
import { dataExportFormats } from '../../../../models/data-export-formats';

import { cloneDeep } from 'lodash';
// tslint:disable-next-line: max-line-length
import { ConnectedPositioningStrategy, HorizontalAlignment, IgxDropDownComponent, IgxDropDownItemComponent, NoOpScrollStrategy, OverlaySettings, PositionSettings, VerticalAlignment } from 'igniteui-angular';
import { GridColumnsService } from '../../../../services/grid-columns.service';
import { MatDialog } from '@angular/material/dialog';
import { MatNewGridComponent } from '../../../../modules/mat-new-grid/mat-new-grid.component';

import { CouchbaseLookupService } from '../../../../services/couchbase-lookup.service';
import { FormControl } from '@angular/forms';

import * as moment from 'moment';
import {GridFiltersService} from '../../../../services/grid-filters.service';



@Component({
    selector: 'app-filter-grid',
    templateUrl: './filter-grid.component.html',
    styleUrls: ['./filter-grid.component.scss']
})
export class FilterGridComponent implements OnInit, OnDestroy, IAgGridBaseParent, OnSearchFilter {

    private subs: Subscription[] = [];
    dt = new Date();

    quickSelectOptions$: Observable<Array<IServerDropdownOption>>;
    quickSelectTitle = '';
    quickSelectValue = '';
    showCalendar1 = false;
    showCalendar2 = false;

    startDate = new FormControl();
    endDate = new FormControl();

     // Data Fetcher Info
     rowCount 
     offSet


    @Input() pageTitle: string;
    @Input() dropdownPosition: string;
    @Input() gridConfigId: string;

    @Input() gridHeight: string;
    @Input() gridWidth: string;
    @Input() mySidebar: Boolean | Object;

    // filters
    @Input() isFilterCollapsed = false;
    @Input() filterConfigId: string;
    @Input() filters: FilterSetting[];
    @Input() showSideBar: Boolean | Object;
    @Input() hideSelectOption = false;
    @Input() hideHiddenDisplay = false;
    @Input() showLoading = false;
    @Input() supressChip = false;

    // for hard reload
    @Input() hardReload = false;
    @Input() progressBG: string;
    @Input() DocId: string;

    // columns

    @Input() columnConfigId: string;
    @Input() columns: IGridColumnAgGrid[];

    @Input() actions: any[];
    @Input() plusActions: any[];

    // quick search type options

    @Input() quickSearchTypeOptionConfigId: string;
    @Input() quickSearchTypeOptions: IServerDropdownOption[];

    // Quick Select Options
    @Input() quickSelectShow = false;
    @Input() quickSelectData: string;

    // NotifyTemp
    @Input() notifyTemp: TemplateRef<any>;
    // actions

    @Input() dataFetcherMethod: (config: any) => Observable<any>;
    @Input() dataExportMethod: (config: any) => Observable<any>;
    @Output() onViewActionClick = new EventEmitter();

    // export

    @Input() exportFormats: IServerDropdownOption[] = [...dataExportFormats];

   
    @Input() rowIndex: number;
    @Input() showCheckBox: boolean;
   


    // references

    @ViewChild('filtersSidebarContainer')
    public filtersSidebarContainer: FiltersSidebarContainerComponent;

    @ViewChild('agGridSearchFilter', { read: AgGridSearchFilterComponent })
    public agGridSearchFilter: AgGridSearchFilterComponent;

    @ViewChild('agGridBase', { read: AgGridBaseComponent })
    public agGridBase: AgGridBaseComponent;

    @ViewChild('agGridContainer')
    public agGridContainer: ElementRef;

    @ViewChildren(IgxDropDownItemComponent) dropDownItems: QueryList<IgxDropDownItemComponent>;

    ranchOptions: { label: string, callback(param?: any) }[] = [
        { label: 'Reset Column', callback: () => { this.deleteCustomConfig(this.gridGuid) } },
        { label: 'Edit', callback: () => { this.openMatDailog(); } },
    ]

    overlaySettings: OverlaySettings;
    positionSettingsLeft = {
        horizontalDirection: HorizontalAlignment.Left,
        horizontalStartPoint: HorizontalAlignment.Right,
        verticalStartPoint: VerticalAlignment.Bottom
    };


    public positionSettings: PositionSettings = {
        horizontalDirection: HorizontalAlignment.Right,
        verticalDirection: VerticalAlignment.Bottom,
        horizontalStartPoint: HorizontalAlignment.Left,
        verticalStartPoint: VerticalAlignment.Bottom
    };



    /**
     * True if all the components data required are ready.
     */
    isGridLoaded = false;

    /**
     * True if the grid has returned the ready event.
     */
    isGridReady = false;

    /**
     * Calculated grid height.
     */
    calcGridHeight = '600px';

    //
    EMPTY_STRING = EMPTY_STRING;
    activeFilters: IActiveFilter[] = [];
    // mySidebar:boolean = false ;
    // sidebar = 'true';
    // sideBar = sidebarColumnsCollapsed;
    dataFetcherFactory: GridDataFetcherFactoryFunc;
    totalRowCount = 0;
    reloadingNow = false;
    toHide: boolean;


    get gridGuid() {
        return this.gridConfigId;
    }

    get columnsList() {
        return this.columns;
    }

    get supplementaryColumns() {
        const self = this;
        if (this.actions && this.actions.length) {
            const copy = cloneDeep(this.filterGridService.supplementaryColumns);
            const colIndex = copy.findIndex(item => item.headerName === 'Actions');
            if (colIndex > -1) {
                copy[colIndex] = {
                    ...copy[colIndex],
                    get actions() {
                        return self.actions
                    },
                    // get filterGrid() { return self },
                    // get filters() { return self.activeFilters },
                };
            }
            return copy;
        } else {
            return [];
        }
    }

    constructor(
        private filterGridService: FilterGridService,
        private gridFilterService: GridFiltersService,
        private elementRef: ElementRef,
        public dialog: MatDialog,
        private gridColumnsService: GridColumnsService,
        private cbLookupService: CouchbaseLookupService,
        private toasterService: ToasterService,
    ) {

    }


    ngOnInit() {
        this.startLoad();

        if (this.dropdownPosition && this.dropdownPosition === 'right') {

            this.overlaySettings = {
                closeOnOutsideClick: true,
                modal: false,
                positionStrategy: new ConnectedPositioningStrategy(this.positionSettings),
                scrollStrategy: new NoOpScrollStrategy()
            };
        } else {

            this.overlaySettings = {
                closeOnOutsideClick: true,
                modal: false,
                positionStrategy: new ConnectedPositioningStrategy(this.positionSettingsLeft),
                scrollStrategy: new NoOpScrollStrategy()
            };

        }
        
        // Check if we have a QuickSelect GUID, if we cant Options and Init the Date Options
        if(this.quickSelectData){
            console.log('We have QuickSelect so we will Init Date Select for GUID : ' + this.quickSelectData)
            this.quickSelectOptions$ = this.cbLookupService.getOptions(this.quickSelectData).pipe(
            tap(res => this.initQuickSelectDate())
            );
        }

        



        // this.startDate.valueChanges.subscribe((o: any) => {


        //     if (this.quickSelectValue === 'date') {
        //         this.runFilterQuery(moment(o).format('YYYY-MM-DD'), this.quickSelectValue, this.quickSelectTitle);
        //     }
        //     if (this.quickSelectValue === 'daterange') {
        //         this.endDate.patchValue(null);
        //     }
        // });

        // this.endDate.valueChanges.subscribe((o: any) => {
        //     if (this.startDate.value && o) {
        //         const startDate = moment(this.startDate.value).format('YYYY-MM-DD');
        //         const endDate = moment(o).format('YYYY-MM-DD');
        //         if (endDate > startDate) {
        //             const searchDate = `${startDate},${endDate}`;
        //         this.runFilterQuery(searchDate, this.quickSelectValue, this.quickSelectTitle);
        //         } else {
        //             this.toasterService.pop('error', 'Invalid Date', 'End Date must be after Start Date !');
        //         }
        //     }

        // })
    }



    onQuickSelect(e) {
        if (this.quickSelectTitle !== e.newSelection.value.name) {

            this.quickSelectTitle = e.newSelection.value.name
            this.quickSelectValue = e.newSelection.value.value
            if (e.newSelection.value.value === 'date' || e.newSelection.value.value === 'daterange') {
                this.showCalendar1 = true;

            } else {
               this.showCalendar1 = false;

               this.runFilterQuery(e.newSelection.value.name, e.newSelection.value.value, e.newSelection.value.name);
               this.endDate.reset();
               this.startDate.reset();
            }

            if (e.newSelection.value.value === 'daterange') {
                this.showCalendar2 = true;
            } else {
                this.showCalendar2 = false;
                this.endDate.reset();
                this.startDate.reset();

            }
        }
    }


    runFilterQuery(qsearch: string , qstype: string, qtypeText: string) {
        // this.agGridBase.onSearchFilterChanged({ newValue: qsearch, qstype: qstype, qtypeText: qtypeText });

        this.agGridBase.updateDataFetcherParam('qsearch', qsearch);
        this.agGridBase.updateDataFetcherParam('qstype', qstype);
        this.agGridBase.updateDataFetcherParam('qtypeText', qtypeText);

        this.gridFilterService.updateFilter({ qsearch: qsearch, qstype: qstype, qtypeText: qtypeText }, this.gridGuid)

        this.agGridBase.onGridReload.emit(
            {currentDataFetcherParams: {qsearch: qsearch, qstype: qstype, qtypeText: qtypeText }}
        )
    }




    startLoad() {
        this.isGridReady = false;
        this.reloadingNow = this.showLoading;
        this.initializeConfig();
        this.setDataFetcherFactory();
    }

    ngOnDestroy(): void {
        if (this.subs) {
            this.subs.forEach(sub => sub.unsubscribe());
        }
        window.onresize = null;
    }

    private initializeConfig() {
            if (this.filterConfigId) {
                // initialize filters
                if (!this.filters || (this.filters && this.hardReload)) {

                    this.filterGridService.getFilterConfig(this.filterConfigId)
                        .subscribe(reply => {
                            this.filters = reply;
                            this.applyFilterDefault();
                           
                        });
                }    else {
                        this.applyFilterDefault();
                        
                }
            } else {
                this.filters = []
            }
            
            // Initialize quick search
            if (!this.quickSearchTypeOptions) {
                this.filterGridService.getQuickSearchTypeOptions(this.quickSearchTypeOptionConfigId)
                    .subscribe(reply => {
                    this.quickSearchTypeOptions = reply;
                });
            }

            // Initialize columns
            if (!this.columns || (this.columns && this.hardReload)) {
                this.filterGridService.getColumnConfig(this.columnConfigId)
                    .subscribe(reply => {
                        this.columns = reply;
              
                });
            }
            setTimeout(() => {
                this.postConfig();
            }, 500)
        }

    private postConfig() {
        this.isGridLoaded = true;
          if (!this.columns || (!this.filters) || !this.quickSearchTypeOptions) {
            return;
        }


        // allow time for the data to render
        if (this.filters.length > 0) {
            setTimeout(() => {
                // attach the filters to app-filters-sidebar-container resources
                this.filtersSidebarContainer.ngAfterContentInit();
                this.listenForFilterChanges();
            }, 100);
        }
    }

    private resize() {

        const top = this.getViewTop(this.agGridContainer.nativeElement);
        this.calcGridHeight = `${window.innerHeight - top - 25}px`;
        this.agGridBase.agGridContainer.nativeElement.style.height = this.calcGridHeight;

    }

    private getViewTop(node) {
        let curtop = 0;
        let curtopscroll = 0;
        if (node.offsetParent) {
            do {
                curtop += node.offsetTop;
                curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
            } while (node = node.offsetParent);

            return (curtop - curtopscroll);
        }
    }



    baseFirstDataRendered(event) {
        // debugger
    }

    baseGridLoaded(gridOptions: any) {
        setTimeout(() => {
            let gridFilters: any = JSON.parse(localStorage.getItem('gridFilters'))
            if (!gridFilters || !gridFilters.length) {
                    gridFilters = [];
            }

            const storedFilters: any = gridFilters.find(x => x.gridGuid === this.gridGuid);
            if (storedFilters && storedFilters.qstype && storedFilters.qstype !== '') {
                // We have stored QuickSelect Info
                const qstype = storedFilters.qstype
                let qsearch = storedFilters.qsearch

                this.quickSelectTitle = storedFilters.qtypeText
                this.quickSelectValue = qstype;

                if (qstype === 'date') {
                    this.showCalendar1 = true;
                    const date1 = new Date(moment(qsearch).format('MM/DD/YYYY'))
                    this.startDate.patchValue(date1)

                }
                if (qstype === 'daterange') {
                    this.showCalendar1 = true;
                    this.showCalendar2 = true;
                    qsearch = qsearch.split(',')

                    const date1 = new Date(moment(qsearch[0]).format('MM/DD/YYYY'))
                    const date2 = new Date(moment(qsearch[1]).format('MM/DD/YYYY'))
                    this.startDate.patchValue(date1)
                    this.endDate.patchValue(date2)
                }

            }

            setTimeout(() => {
                            gridOptions.api.selectIndex(50, false, false);
                            //storedFilters.rowIndex = 0;
                            this.gridFilterService.setFilter(gridFilters)
                        }, 200)

            // if (storedFilters && storedFilters.activeFilters) {
            //     if (storedFilters.rowIndex) {
            //         gridOptions.api.ensureIndexVisible(storedFilters.rowIndex, 'middle');
            //         setTimeout(() => {
            //             gridOptions.api.selectIndex(storedFilters.rowIndex, false, false);
            //             storedFilters.rowIndex = 0;
            //             this.gridFilterService.setFilter(gridFilters)
            //         }, 200);

            //     }
            // }
        }, 100);
    }

    baseGridReady($event) {
        if (this.filters && this.filters.length > 0) {
            this.filtersSidebarContainer.ngAfterContentInit();
        }
        this.isGridReady = true;

        window.onresize = () => this.resize();
        this.resize();
        // Check if we have Filters and If So apply Them
        if (this.filters && this.filters.length > 0) {
            // Get the State from Window History
            const stateFilters = window.history.state;
            // const activeFilters: IActiveFilter[] = state.activeFilters;
            let activeFilters: IActiveFilter[];

            // =========================Get Localstorage===============================
            let gridFilters: any = JSON.parse(localStorage.getItem('gridFilters'))
            // Check if there is a Object gridFilters in the Local Store
            if (!gridFilters || !gridFilters.length) {
                gridFilters = [];
            }
            
            // Get the stored Filter's for the GridGuid
            const storedFilters: any = gridFilters.find(x => x.gridGuid === this.gridGuid);

            if (stateFilters && stateFilters.activeFilters) {
                ('BaseGridReady Filter Grid using State Filters')
                console.log(stateFilters)
                this.DocId = stateFilters.docId
                this.rowIndex = stateFilters.rowIndex
                activeFilters = stateFilters.activeFilters;
            } else if(storedFilters && storedFilters.activeFilters)  {
                activeFilters = storedFilters.activeFilters;
                ('BaseGridReady Filter Grid using Stored Filters')
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
        } else {
            // If there is no Filter we will have to set Data Source so we load Data
            this.agGridBase.setDataSource();
        }
        

    }


    // filters
    private applyFilterDefault() {
       //  const gridFilters = JSON.parse(localStorage.getItem('gridFilters'));
       // if (gridFilters && gridFilters.length > 0) {

         //   if (gridFilters.length && gridFilters.find(x => x.gridGuid === this.gridGuid)) {
         //       const filteredGrid = gridFilters.find(x => x.gridGuid === this.gridGuid);
        
         const filteredGrid = this.gridFilterService.getDefaultFilter(this.gridGuid)
         
         if (filteredGrid && filteredGrid.activeFilters) {
                    filteredGrid.activeFilters.map(x => {
                        if (x.value[0].selected === true) {
                            const filter: any = this.filters.find(c => c.group === x.group)
                            if (filter) {
                                filter.filters.map(b => {
                                    b.selected = false;
                                })// uncheck all options for filter
                                filter.filters.find(v => v.name === x.value[0].name).selected = true;
                            }
                        }
                    });
                }

            
        

        this.filters.forEach(filter => {
            filter.resetFiltersFunc = this.resetSelectionSingleOptionFilter;
            filter.group = filter.group || filter.label;
        });
    }

    private listenForFilterChanges() {
        this.subs.push(
            this.filtersSidebarContainer
                .resources
                .pipe(
                    debounceTime(1000),
                    distinctUntilChanged(),
                )
                .subscribe(filters => {
                    this.onSideBarFilter(filters);
                })
        );
    }

    private resetSelectionSingleOptionFilter(filters: any[]) {
        return filters.map(option => {
            option.selected = option.value === EMPTY_STRING;
            return option;
        });
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
    }

    private onSideBarFilter(filters: IActiveFilter[]) {
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
        if (this.filters && this.filters.length > 0) {
            this.filtersSidebarContainer.filterComponents.forEach(filterComponent => {
                if (filterComponent.group === filterType) {
                    filterComponent.filterChanged(filter, !filterRemoved);
                }
            })
        }

    }

    // grid

    onView(DocId: string) {
        console.log('We are viewing the Doc')
        const params = {
            docId: DocId,
            grid: this.agGridBase,
            filters: this.activeFilters
        };

        console.log(params)
        this.onViewActionClick.emit(params);
    }

    allDataLoaded() {
        this.reloadingNow = false;
    }

    /**
     * Set the data fetcher factory function to be passed into the base grid component
     * @param fetcherParams
     */
    setDataFetcherFactory(fetcherParams?: IGridDataFetcherParams) {
        this.dataFetcherFactory = (params: IServerSideGetRowsParams) => {
            console.log('[Datasource] - rows requested by grid: ', params.request);
            return this.dataFetcherMethod(
                {
                    /**
                     * @note: Prefer fetcherParams if passed in
                     * @note: fetcherParams can be either from the default grid or the export grid,
                     * which is taken into account when setting perPage and offset below
                     */
                    ...this.agGridBase.getDataFetcherParams(),
                    ...(fetcherParams && fetcherParams),
                    // tslint:disable-next-line:max-line-length
               
                    // sortColumn : params.request.sortModel[0] && params.request.sortModel[0].colId ? params.request.sortModel[0].colId : '',
                    // sortOrder:  params.request.sortModel[0] && params.request.sortModel[0].sort ? params.request.sortModel[0].sort : '',

                    sortModel : params.request.sortModel[0] ? params.request.sortModel : '',
                    
                    perPage: fetcherParams && fetcherParams.perPage ? fetcherParams.perPage : params.request.endRow - params.request.startRow, // endRow - startRow gives perPage value
                    offset: fetcherParams && fetcherParams.offset ? fetcherParams.offset : params.request.startRow,
                    // qsearch: fetcherParams && fetcherParams.qsearch,
                }
            )
                .pipe(
                    map((res: IApiResponseBody) => {
                        this.totalRowCount = res.RowCount;
                        const rowsThisPage = addGridActions(res.Data, [viewGridAction]);

                        return {
                            rowsThisPage,
                            totalRowCount: res.RowCount,
                        };
                    }),
                );
        };
    }

    onGridReload($event: IGridReloadPayload) {
        if (this.hardReload) {
            // this.hardReloadInit.emit(true);
            this.toHide = true;
            setTimeout(() => {
                this.startLoad();
                this.toHide = false;
            }, 200);
            return;
        }
        this.reloadingNow = this.showLoading;
        this.setDataFetcherFactory($event.currentDataFetcherParams);
        this?.agGridBase?.setDataSource(() => {
        });
    }

    onExport($event: IDataExportDialogResult) {
        this.dataExportMethod({
            ...this.agGridBase.getDataFetcherParams(),
            ...($event.exportAllColumns && { cols: 'all' }),
        })
            .pipe(take(1))
            .subscribe(res =>
                // tslint:disable-next-line:no-unused-expression
                this.agGridBase && this.agGridBase.independentExport({
                    export_data: res.Data.export_data,
                    export_def: res.Data.export_def,
                    exportFormat: $event.exportFormat,
                    fileName: $event.fileName,
                })
            );
    }

    get selectedRowIds(): string[] {
        return this.agGridBase && this.agGridBase.selectedRowIds;
    }

    fetchColumnsList(gridGuid: string) {
    }

    get checkShowForSingleActionCount() {
        let count = 0;
        this.plusActions.forEach(
            item => {
                if (this.showPlusAction('modal', item)) { count++; }
            }
        )
        return count == 1;
    }

    showPlusAction(actionName: string, plusAction) {
        if (actionName !== plusAction.action) {
            return false;
        }
        if (!plusAction.selected || !plusAction.selected.length) {
            return true;
        }
        for (const select of plusAction.selected) {
            switch (select) {
                case 'one':
                    if (this.agGridBase.selectedRowIds.length === 1) {
                        return true
                    };
                    break;
                case 'many':
                    if (this.agGridBase.selectedRowIds.length > 1) {
                        return true
                    };
                    break;
                case 'none':
                    if (this.agGridBase.selectedRowIds.length === 0) {
                        return true
                    };
                    break;
                case 'any':
                    return true;
            }
        }
        return false;
    }
    openDropDown(dropdown: IgxDropDownComponent, target) {
        if (dropdown.collapsed) {
            const overlaySettings: OverlaySettings = {
                modal: false,
                target: target,
                positionStrategy: new ConnectedPositioningStrategy(
                    this.positionSettings
                )
            };
            dropdown.open(overlaySettings);
        }
    }

    actionChange(event) {
        if (event.newSelection && event.newSelection.value) {
            console.log(event)
            this.executeAction(event.newSelection.value.toString());
        }
    }
    click() {
          this.executeAction(this.plusActions[0]);
    }
    private executeAction(action: string) {
        if (action === 'Notification dialog') {
            //   this.dialog.open();
            // } else {
            //   let id = Number.parseInt(action.replace("Delete rowID: ", ""));
            //   this.grid1.deleteRowById(id);
        }
    }

    reload() {
        this.agGridBase.reloadData();
    }
    deleteCustomConfig(gridId) {

        this.gridColumnsService.deleteCustomLayout(gridId).subscribe(grid => { console.log(grid) })
        // Relaod grid after we deleted custom config
        this.agGridBase.reloadData()

    }

    openMatDailog() {
        const dialogRef = this.dialog.open(MatNewGridComponent,
            {
                data: { title: 'Edit', rightButtonText: 'No' },
                disableClose: true, width: '900px', position: {
                    top: '50px'
                },
                panelClass: 'no-pad-dialog',
                autoFocus: false
            })
        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                dialogRef.close()
            } else {
            }
        });
    }

    checkIfonTop() {
        setTimeout(() => {
            const newFarm = document.querySelector('app-new-farm-list');
            if (newFarm) {
                const right30 = document.querySelector('.right-30');
                if (right30) {
                    right30.classList.add('on-top-page');
                }
            }
        }, 200)
    }

    initQuickSelectDate() {
        console.log('We init the Date Fields for QuickSelect')
        // Subscribe to any Changes for the Start Date on Quick Select Filter
        this.startDate.valueChanges.subscribe((o: any) => {
            if (this.quickSelectValue === 'date') {
                this.runFilterQuery(moment(o).format('YYYY-MM-DD'), this.quickSelectValue, this.quickSelectTitle);
            }
            if (this.quickSelectValue === 'daterange') {
                this.endDate.patchValue(null);
            }
        });
        // Subscribe to any Changes for the End Date on Quick Select Filter
        this.endDate.valueChanges.subscribe((o: any) => {
            if (this.startDate.value && o) {
                const startDate = moment(this.startDate.value).format('YYYY-MM-DD');
                const endDate = moment(o).format('YYYY-MM-DD');
                if (endDate > startDate) {
                    const searchDate = `${startDate},${endDate}`;
                this.runFilterQuery(searchDate, this.quickSelectValue, this.quickSelectTitle);
                } else {
                    this.toasterService.pop('error', 'Invalid Date', 'End Date must be after Start Date !');
                }
            }

        })
    }

    onSearchFilterChanged(filterResult: IAgGridSearchFilterResult) {
        console.log('Update Filter Filter Grid')

        this.agGridBase.updateDataFetcherParam('qsearch', filterResult.newValue);
        this.agGridBase.updateDataFetcherParam('qstype', filterResult.qstype);
        this.agGridBase.updateDataFetcherParam('qtypeText', filterResult.qtypeText);

        this.gridFilterService.updateFilter(filterResult, this.gridGuid)

        // ===================Update Localstorage====================================
        // this.searchFilterChange.emit({ qsearch: filterResult.newValue, qstype: filterResult.qstype })
        this.agGridBase.onGridReload.emit(
            {currentDataFetcherParams: {qsearch: filterResult.newValue, qstype: filterResult.qstype, qtypeText: filterResult.qtypeText}}
        )
        // this.setDataSource();
    }




}
