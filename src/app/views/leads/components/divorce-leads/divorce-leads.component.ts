import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IGridDataFetcherParams} from '../../../../modules/custom-ag-grid/ag-grid-base';
import {first, map, tap} from 'rxjs/operators';
import {ColDef, IServerSideGetRowsParams} from 'ag-grid-community';
import {IApiResponseBody} from '../../../../models/api-response-body';
import {DialogService} from '../../../../services/dialog.service';
import {FormOperation} from '../../../../models/form-operation';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {IGridColumnAgGrid} from '../../../../models/grid-column';
import {isObservable, Observable} from 'rxjs';
import {GridColumnsService} from '../../../../services/grid-columns.service';
import {AgGridBaseComponent} from '../../../../modules/custom-ag-grid/components/ag-grid-base/ag-grid-base.component';
import {sidebarColumnsCollapsed} from '../../../../modules/custom-ag-grid/sidebar-configurations/sidebar-columns-collapsed';
import {GridDataFetcherFactoryFunc} from '../../../../types/grid-data-fetcher-factory-func';
import {DivorceLeadService} from '../../../../services/divorce-lead.service';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {DivorceLeadFiltersSidebarComponent, IDivorceLeadFilterResult} from '../filters-sidebar/divorce-lead-filters-sidebar.component';
import {DivorceLeadFilter} from '../../../../enums/divorce-lead.filter';

@Component({
    selector: 'app-divorce-leads',
    templateUrl: './divorce-leads.component.html',
    styleUrls: ['./divorce-leads.component.scss']
})
export class DivorceLeadsComponent implements OnInit, OnDestroy {

    sideBar = sidebarColumnsCollapsed;
    alive = true;

    gridGuid = GridColumnsListGuids.DIVORCE_LEADS_GRID;
    columnsList$: Observable<IGridColumnAgGrid[]>;
    columnsList: IGridColumnAgGrid[] = [];
    columnDefs: ColDef[];

    dataFetcherFactory: GridDataFetcherFactoryFunc;

    filters = DivorceLeadFilter;
    activeFilters: IDivorceLeadFilterResult = {};

    @Input() theme = 'ag-theme-balham';

    @ViewChild('filterSidebar', {read: DivorceLeadFiltersSidebarComponent})
    public filterSidebar: DivorceLeadFiltersSidebarComponent;

    @ViewChild('agGridBase', {read: AgGridBaseComponent})
    public agGridBase: AgGridBaseComponent;

    constructor(
        private cdRef: ChangeDetectorRef,
        private dialogService: DialogService,
        private columnsService: GridColumnsService,
        private divorceLeadService: DivorceLeadService,
    ) {
        this.fetchColumnsList();
    }

    ngOnInit() {
        this.setDataFetcherFactory();
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
        //
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
            return this.divorceLeadService.getAll(
                {
                    /**
                     * @note: Prefer fetcherParams if passed in
                     * @note: fetcherParams can be either from the default grid or the export grid,
                     * which is taken into account when setting perPage and offset below
                     */
                    ...this.agGridBase.getDataFetcherParams(),
                    ...(fetcherParams && {fetcherParams}),
                    perPage: fetcherParams && fetcherParams.perPage ? fetcherParams.perPage : this.agGridBase.api.paginationGetPageSize(), // endRow - startRow gives perPage value
                    offset: fetcherParams && fetcherParams.offset ? fetcherParams.offset : params.request.startRow,
                    // qsearch: fetcherParams && fetcherParams.qsearch,
                }
            )
                .pipe(
                    map((res: IApiResponseBody) => {
                        // const rowsThisPage = addGridActions<IBaseNote>(res.Data);
                        const rowsThisPage = res.Data;

                        return {
                            rowsThisPage,
                            totalRowCount: res.RowCount,
                        };
                    }),
                );
        };
    }

    private setActiveFilters(filters: IDivorceLeadFilterResult) {
        this.activeFilters = filters;
        this.cdRef.detectChanges(); // Avoid expression changed after it was checked error
    }

    onSideBarFilter($event: IDivorceLeadFilterResult) {
        // Make sure grid has been initialized before trying to update the datasource
        if (this.agGridBase && this.agGridBase.api) {
            this.setActiveFilters($event);

            // update data fetcher options
            for (const key in $event) {
                if ($event.hasOwnProperty(key)) {

                    const filter: DivorceLeadFilter = <DivorceLeadFilter>key;
                    const filterValues = <IServerDropdownOption[]>$event[filter];
                    this.agGridBase.updateDataFetcherParam(filter, filterValues.map(filterValue => filterValue.value));
                }
            }

            this.setDataFetcherFactory();
            this.agGridBase.setDataSource();
        }
    }

    activeFilterRemoved(filterType: DivorceLeadFilter, changedFilter: IServerDropdownOption) {
        // construct the observable name as is in the filter sidebar component
        const sidebarObservableName = `${filterType}Options$`;
        const changedFilterCopy = {...changedFilter};
        changedFilterCopy.selected = false;

        if (this.filterSidebar && this.filterSidebar[sidebarObservableName] && isObservable(this.filterSidebar[sidebarObservableName])) {
            this.filterSidebar[sidebarObservableName]
                .pipe(
                    first(), // take only the first subscription, this operator will automatically unsubscribe the observable
                )
                // filterTypeCurrentOptions === options returned by the filter type constructed above's observable inside the filterSidebar
                .subscribe((filterTypeCurrentOptions: IServerDropdownOption[]) => {
                    console.log('current options ', filterTypeCurrentOptions);
                    this.filterSidebar.updateOptionSelection({
                        filter: filterType,
                        observableName: sidebarObservableName,
                        optionsList: [...filterTypeCurrentOptions],
                        changed: changedFilterCopy,
                    });
                });
        }
    }

    onView(DocId: string) {
        this.openDialog({DocId, formOperation: 'view'});
    }

    onEdit(DocId: string) {
        this.openDialog({DocId, formOperation: 'update'});
    }

    onDelete(DocId: string | Array<string>) {
    }

    openDialog(params: { DocId?: string, formOperation: FormOperation }) {
        //
    }
}
