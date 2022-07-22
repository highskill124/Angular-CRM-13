import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IGridDataFetcherParams} from '../../../../modules/custom-ag-grid/ag-grid-base';
import {first, map, tap} from 'rxjs/operators';
import {ColDef, IServerSideGetRowsParams} from 'ag-grid-community';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {GridColumnsService} from '../../../../services/grid-columns.service';
import {IGridColumnAgGrid} from '../../../../models/grid-column';
import {isObservable, Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {MessageTrackingService} from '../../../../services/message-tracking.service';
import {MessageTrackingFilter} from '../../../../enums/message-tracking-filter.enum';
import {
    IMessageTrackingFilterResult,
    MessageTrackingFiltersSidebarComponent
} from '../filters-sidebar/message-tracking-filters-sidebar.component';
import {editGridAction, viewGridAction} from '../../../../models/grid';
import {ITrackedMessage} from '../../../../models/tracked-message';
import {ActionsRendererComponent} from '../../../../modules/custom-ag-grid/components/actions-renderer/actions-renderer.component';
import {CheckboxCellComponent} from '../../../../modules/custom-ag-grid/components/checkbox-cell/checkbox-cell.component';
import {MultiKeyValueItemRendererComponent} from '../../../../modules/custom-ag-grid/components/multi-key-value-item-renderer/multi-key-value-item-renderer.component';
import {EmailsTooltipRenderer} from '../../../../modules/custom-ag-grid/render-functions/tooltip-renderers';
import {TooltipedValueRendererComponent} from '../../../../modules/custom-ag-grid/components/tooltip-container/tooltiped-value-renderer.component';
import {DateAndTimeRenderer, DateRenderer} from '../../../../modules/custom-ag-grid/render-functions/date-renderer';
import {IAgGridBaseParent} from '../../../../models/ag-grid-base-parent';
import {sidebarColumnsCollapsed} from '../../../../modules/custom-ag-grid/sidebar-configurations/sidebar-columns-collapsed';
import {GridDataFetcherFactoryFunc} from '../../../../types/grid-data-fetcher-factory-func';
import {AgGridBaseComponent} from '../../../../modules/custom-ag-grid/components/ag-grid-base/ag-grid-base.component';
import {addGridActions} from '../../../../helpers/add-grid-actions';

@Component({
    selector: 'app-farms-list-ag-grid',
    templateUrl: './message-tracking-grid.component.html',
    styleUrls: ['./message-tracking-grid.component.scss']
})
export class MessageTrackingGridComponent implements OnInit, OnDestroy, IAgGridBaseParent {

    filters = MessageTrackingFilter;
    activeFilters: IMessageTrackingFilterResult = {};

    sideBar = sidebarColumnsCollapsed;
    alive = true;

    gridGuid = GridColumnsListGuids.MESSAGE_TRACKING_GRID;
    columnsList$: Observable<IGridColumnAgGrid[]>;
    columnsList: IGridColumnAgGrid[] = [];
    supplementaryColumnDefs: ColDef[];
    dataFetcherFactory: GridDataFetcherFactoryFunc;

    @ViewChild('filterSidebar', {read: MessageTrackingFiltersSidebarComponent})
    public filterSidebar: MessageTrackingFiltersSidebarComponent;

    @ViewChild('agGridBase', {read: AgGridBaseComponent})
    public agGridBase: AgGridBaseComponent;

    constructor(
        private cdRef: ChangeDetectorRef,
        private columnsService: GridColumnsService,
        private trackingService: MessageTrackingService,
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
        this.supplementaryColumnDefs = columnsList.map(column => {
            return {
                ...(column.field === 'notify' && {
                    cellRendererFramework: CheckboxCellComponent,
                }),
                ...(column.field === 'send_DateTime' && {
                    cellRendererFramework: TooltipedValueRendererComponent,
                    cellRendererParams: {
                        valueRenderer: DateRenderer,
                        tooltipRenderer: DateAndTimeRenderer,
                    },
                }),
                /*...(column.field === 'last_event_DateTime' && {
                    cellRenderer: (data) => {
                        // const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
                        return data.value ? (new Date(data.value)).toLocaleDateString() + ' ' + (new Date(data.value)).toLocaleTimeString() : '';
                    },
                }),*/
                ...(column.field === 'send_to' && {
                    cellRendererFramework: MultiKeyValueItemRendererComponent,
                    cellRendererParams: {
                        field: 'send_to',
                        showName: 'no',
                        tooltipRenderer: EmailsTooltipRenderer,
                    },
                }),
                ...(column.field === 'send_cc' && {
                    cellRendererFramework: MultiKeyValueItemRendererComponent,
                    cellRendererParams: {
                        field: 'send_cc',
                        showName: 'no',
                        tooltipRenderer: EmailsTooltipRenderer,
                    },
                }),
                ...(column.field === 'send_bcc' && {
                    cellRendererFramework: MultiKeyValueItemRendererComponent,
                    cellRendererParams: {
                        field: 'send_bcc',
                        showName: 'no',
                        tooltipRenderer: EmailsTooltipRenderer,
                    },
                }),
            };
        });
        this.supplementaryColumnDefs = [
            ...this.supplementaryColumnDefs,
            {
                headerName: 'Actions',
                width: 100,
                sortable: false,
                suppressMenu: true,
                cellRendererFramework: ActionsRendererComponent,
                pinned: 'right',
            },
        ];
    }

    onView(DocId: string) {
    }

    onEdit(DocId: string) {
    }

    onDelete(DocId: string | Array<string>) {
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
            return this.trackingService.getAll(
                {
                    /**
                     * @note: Prefer fetcherParams if passed in
                     * @note: fetcherParams can be either from the default grid or the export grid,
                     * which is taken into account when setting perPage and offset below
                     */
                    ...this.agGridBase.getDataFetcherParams(),
                    ...(fetcherParams && fetcherParams),
                    perPage: fetcherParams && fetcherParams.perPage ? fetcherParams.perPage : this.agGridBase.api.paginationGetPageSize(), // endRow - startRow gives perPage value
                    offset: fetcherParams && fetcherParams.offset ? fetcherParams.offset : params.request.startRow,
                },
                false
            )
                .pipe(
                    map(res => {

                        res.Data = res.Data && res.Data.map(message => {

                            // convert emails inside sent_to array to IServerDropdownItem format
                            if (message.send_to) {
                                message.send_to = message.send_to.map(emailAddress => {
                                    return {
                                        name: null,
                                        value: emailAddress,
                                        selected: true,
                                    };
                                });
                            }
                            // convert emails inside sent_cc array to IServerDropdownItem format
                            if (message.send_cc) {
                                message.send_cc = message.send_cc.map(emailAddress => {
                                    return {
                                        name: null,
                                        value: emailAddress,
                                        selected: true,
                                    };
                                });
                            }
                            // convert emails inside sent_bcc array to IServerDropdownItem format
                            if (message.send_bcc) {
                                message.send_bcc = message.send_bcc.map(emailAddress => {
                                    return {
                                        name: null,
                                        value: emailAddress,
                                        selected: true,
                                    };
                                });
                            }

                            return message;
                        });
                        return res;
                    }),
                    map((res) => {
                        const rowsThisPage = addGridActions<ITrackedMessage>(res.Data, [viewGridAction, editGridAction]);

                        return {
                            rowsThisPage,
                            totalRowCount: res.RowCount,
                        };
                    }),
                );
        };
    }

    private setActiveFilters(filters: IMessageTrackingFilterResult) {
        this.activeFilters = filters;
        this.cdRef.detectChanges(); // Avoid expression changed after it was checked error
    }

    onSideBarFilter($event: IMessageTrackingFilterResult) {

        // Make sure grid has been initialized before trying to update the datasource
        if (this.agGridBase && this.agGridBase.api) {
            this.setActiveFilters($event);

            // update data fetcher options
            for (const key in $event) {
                if ($event.hasOwnProperty(key)) {

                    const filter: MessageTrackingFilter = <MessageTrackingFilter>key;
                    const filterValues = <IServerDropdownOption[]>$event[filter];
                    this.agGridBase.updateDataFetcherParam(filter, filterValues.map(filterValue => filterValue.value));
                }
            }

            this.setDataFetcherFactory();
            this.agGridBase.setDataSource();
        }
    }

    activeFilterRemoved(filterType: MessageTrackingFilter, changedFilter: IServerDropdownOption) {
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
                    this.filterSidebar.updateOptionSelection({
                        filter: filterType,
                        observableName: sidebarObservableName,
                        optionsList: [...filterTypeCurrentOptions],
                        changed: changedFilterCopy,
                    });
                });
        }
    }
}
