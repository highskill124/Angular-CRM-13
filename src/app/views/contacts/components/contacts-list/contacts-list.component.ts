import {AfterViewInit, ChangeDetectorRef, Component,Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {AgGridBase, IContactDataFetcherParams} from '../../../../modules/custom-ag-grid/ag-grid-base';
import {ActionsRendererComponent} from '../../../../modules/custom-ag-grid/components/actions-renderer/actions-renderer.component';
import {debounceTime, distinctUntilChanged, shareReplay, takeWhile} from 'rxjs/operators';
import {IMainContactGrid} from '../../../../models/contact';
import {GridAction} from '../../../../models/grid';
import {GridOptions, IServerSideDatasource, RowNode} from 'ag-grid-community';
import {Router} from '@angular/router';
import {MultiKeyValueItemRendererComponent} from '../../../../modules/custom-ag-grid/components/multi-key-value-item-renderer/multi-key-value-item-renderer.component';
import {MultiSelectItemEditorComponent} from '../../../../modules/custom-ag-grid/components/editors/multi-select-item-editor/multi-select-item-editor.component';
import {IOptionMultiSelectBox} from '../../../../modules/multi-select-box/components/multi-select-box/multi-select-box.component';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {FiltersSidebarComponent} from '../filters-sidebar/filters-sidebar.component';
import {ContactFilter} from '../../../../enums/contact-filter.enum';
import {BucketsTooltipRenderer, EmailsTooltipRenderer} from '../../../../modules/custom-ag-grid/render-functions/tooltip-renderers';
import {FiltersSidebarContainerComponent} from '../../../../modules/filter/components/filters-sidebar/filters-sidebar-container.component';
import {IActiveFilter} from '../../../../modules/filter/components/filter/filter.component';
import {TagService} from '../../../../services/tag.service'
import {BucketService} from '../../../../services/bucket.service'


@Component({
    selector: 'app-contacts-list',
    templateUrl: './contacts-list.component.html',
    styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent extends AgGridBase implements OnInit, AfterViewInit, OnDestroy {
    collapsed = false;
    isFiltersEnabled = true;
    rowModelType = 'serverSide';
    cacheBlockSize = 100;
    maxBlocksInCache = 10;
    alive = true;
    serverSideStoreType = 'partial';

    contactFilters = ContactFilter;
    dataFetcherParams: IContactDataFetcherParams = {};
    activeFilters: IActiveFilter[] = [];

    tagOptions$: Observable<IServerDropdownOption[]>;
    bucketOptions$: Observable<IServerDropdownOption[]>;
    typeOptions: IServerDropdownOption[] = [
        {value: 'active', name: 'Active', selected: true},
        {value: 'archived', name: 'Archived', selected: false},
        {value: 'duplicate', name: 'Duplicate', selected: false},
    ];

    @ViewChild('filtersSidebarContainer')
    public filtersSidebarContainer: FiltersSidebarContainerComponent;
    @ViewChild('filterSidebar', {read: FiltersSidebarComponent})
    public filterSidebar: FiltersSidebarComponent;

    constructor(
        private cdRef: ChangeDetectorRef,
        private contactsService: ContactsService,
        private bucketService: BucketService,
        private tagService: TagService,
        // private toasterService: ToasterService,
        private router: Router,
    ) {
        super();
        // set tagsOptions$ and bucketsOptions$ before setting columns since they are referenced there
        this.tagOptions$ = this.tagService.tagList('Contact').pipe(shareReplay());
        this.bucketOptions$ = this.bucketService.bucketList('Contact').pipe(shareReplay());
        this.createColumnDefs();
    }

    ngOnInit() {
        this.gridOptions = <GridOptions>{
            context: {
                componentParent: this,
            },
            defaultColDef: {
                resizable: true,
                sortable: true,
                /**
                 * Use this when agGrid issue AG-2845 is fixed
                 * @see https://github.com/ag-grid/ag-grid/issues/3007
                 */
                // tooltipComponent: 'customTooltip',
            },
            /**
             * Use this when agGrid issue AG-2845 is fixed
             * @see https://github.com/ag-grid/ag-grid/issues/3007
             */
            /*frameworkComponents: {
                customTooltip: CustomTooltip,
            },*/
            /**
             * @see https://github.com/ag-grid/ag-grid-angular/issues/121
             */
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this)
        };
    }

    ngAfterViewInit(): void {
        this.listenForFilterChanges();
    }

    listenForFilterChanges() {
        this.filtersSidebarContainer.resources
            .pipe(
                takeWhile(() => this.alive),
                debounceTime(500),
                distinctUntilChanged(),
            )
            .subscribe(filters => {
                this.onSideBarFilter(filters);
            });
    }

    onSideBarFilter($event: IActiveFilter[]) {
        this.setActiveFilters($event);

        // update data fetcher options
        $event.forEach(filter => {
            this.updateDataFetcherOption(
                <ContactFilter>filter.group,
                filter.value.map(filterValue => filterValue.value));
        });

        // Make sure grid has been initialized before trying to update the datasource
        if (this.api) {
            this.setDataSource(this.dataFetcherParams);
        }

    }

    onReady($event) {
        this.gridOptions = {
            ...this.gridOptions,
            ...$event,
        };
        this.calculateRowCount();

        // this.fetchData(this.gridOptions);

        this.setDataSource();
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Name',
                field: 'Name',
                width: 200,
                checkboxSelection: true,
                // sortable: false,
            },
            {
                headerName: 'Email',
                field: 'emails',
                width: 150,
                sortable: false,
                cellRendererFramework: MultiKeyValueItemRendererComponent,
                cellRendererParams: {
                    field: 'emails',
                    tooltipRenderer: EmailsTooltipRenderer,
                },
                /*tooltip: function (params) {
                    return EmailsTooltipRenderer(params.value);
                },*/

                /**
                 * Use this when agGrid issue AG-2845 is fixed
                 * @see https://github.com/ag-grid/ag-grid/issues/3007
                 */
                /*tooltipField: "emails",
                tooltipComponentParams: { color: "#ececec", renderFunction: EmailsTooltipRenderer },
                tooltipValueGetter: function (params) {
                    return EmailsTooltipRenderer(params);
                },*/
            },
            {
                headerName: 'Home',
                field: 'phones',
                width: 150,
                sortable: false,
                cellRenderer: (params) => {
                    if (params.value) {
                        const homePhone = params.value.find(phone => phone.name === 'home');
                        if (homePhone) {
                            return `<div>${homePhone.value}</div>`
                        }
                    } else {
                        return null;
                    }
                },
            },
            {
                headerName: 'Mobile',
                field: 'phones',
                width: 150,
                sortable: false,
                // suppressMenu: true,
                cellRenderer: (params) => {
                    if (params.value) {
                        const mobilePhone = params.value.find(phone => phone.name === 'mobile');
                        if (mobilePhone) {
                            return `<div>${mobilePhone.value}</div>`
                        }
                    } else {
                        return null;
                    }
                },
            },
            {
                headerName: 'Work',
                field: 'phones',
                width: 150,
                sortable: false,
                cellRenderer: (params) => {
                    if (params.value) {
                        const workPhone = params.value.find(phone => phone.name === 'work');
                        if (workPhone) {
                            return `<div>${workPhone.value}</div>`
                        }
                    } else {
                        return null;
                    }
                },
            },
            {
                headerName: 'Bucket',
                field: 'buckets',
                width: 150,
                sortable: false,
                cellRendererFramework: MultiKeyValueItemRendererComponent,
                cellRendererParams: {
                    showValue: 'no',
                    hasClickAction: true,
                    tooltipRenderer: BucketsTooltipRenderer,
                },
                editable: true,
                cellEditorFramework: MultiSelectItemEditorComponent,
                cellEditorParams: {
                    data: {
                        options: this.bucketOptions$,
                    },
                },
                /**
                 * Use this when agGrid issue AG-2845 is fixed
                 * @see https://github.com/ag-grid/ag-grid/issues/3007
                 */
                /*tooltipField: "buckets",
                tooltipComponentParams: { color: "#ececec", renderFunction: BucketsTooltipRenderer },
                tooltipValueGetter: function (params) {
                    return BucketsTooltipRenderer(params);
                },*/
                /*tooltip: function (params) {
                    return BucketsTooltipRenderer(<IServerDropdownOption[]>params.value);
                },*/
            },
            {
                headerName: 'Follow Up',
                field: 'followup',
                width: 150,
                sortable: false,
                cellRendererFramework: MultiKeyValueItemRendererComponent,
            },
            {
                headerName: 'Last Contact',
                field: 'lastactivity',
                width: 150,
                sortable: false,
            },
            {
                headerName: 'Tags',
                field: 'tags',
                width: 150,
                sortable: false,
                cellRendererFramework: MultiKeyValueItemRendererComponent,
                cellRendererParams: {
                    showValue: 'no',
                    hasClickAction: true,
                    tooltipRenderer: BucketsTooltipRenderer,
                },
                editable: true,
                cellEditorFramework: MultiSelectItemEditorComponent,
                cellEditorParams: {
                    data: {
                        options: this.tagOptions$
                    },
                },
                /**
                 * Use this when agGrid issue AG-2845 is fixed
                 * @see https://github.com/ag-grid/ag-grid/issues/3007
                 */
                /*tooltipField: "tags",
                tooltipComponentParams: { color: "#ececec", renderFunction: BucketsTooltipRenderer },
                tooltipValueGetter: function (params) {
                    return BucketsTooltipRenderer(params);
                },*/
                /*tooltip: function (params) {
                    return BucketsTooltipRenderer(<IServerDropdownOption[]>params.value);
                },*/
            },
            {
                headerName: 'Actions',
                width: 150,
                sortable: false,
                suppressMenu: true,
                suppressMovable: true,
                lockVisible: true,
                lockPinned: true,
                cellRendererFramework: ActionsRendererComponent,
                pinned: 'right',
            },
        ];
    }

    /**
     * field determines the field to update in contact
     * rowNode is used to extract the contact id from grid node data
     * updated options represents new selected data to be saved
     * @param field
     * @param rowNode
     * @param selectedOptions
     */
    onMultiSelectItemEdit(field: string, rowNode: RowNode, selectedOptions: IOptionMultiSelectBox[]) {
        const DocIds = selectedOptions.map(option => option.value);

        switch (field) {
            case 'buckets':
                // push to api and update row cell in editor
                this.contactsService.updateBuckets(rowNode.data.DocId, DocIds)
                    .pipe(
                        takeWhile(() => this.alive),
                    )
                    .subscribe((res: any) => {
                        if (res.Success === true) {
                            // update row cell here
                            this.gridOptions.api.getRowNode(rowNode.data.DocId).setDataValue(field, selectedOptions);
                        }
                    });
                break;
            case 'tags':
                this.contactsService.updateTags(rowNode.data.DocId, DocIds)
                    .pipe(
                        takeWhile(_ => this.alive),
                    )
                    .subscribe((res: any) => {
                        if (res.Success === true) {
                            // update row cell here
                            this.gridOptions.api.getRowNode(rowNode.data.DocId).setDataValue(field, selectedOptions);
                        }
                    });
                break;
        }
    }

    onView(params: any) {
        this.router.navigate(['/Contacts/ContactDetails', params.data.DocId]);
    }

    onEdit(DocId: string) {
        this.router.navigate(['/Contacts/ContactUpdate', DocId]);
    }

    onDelete(DocId: string | Array<string>) {
        // prepare contact ids array to pass to contact delete service
        const idsArray = Array.isArray(DocId) ? DocId : [DocId];
        if (confirm(`Delete contact${idsArray.length > 1 ? 's' : ''}?`)) {
            this.contactsService.delete(idsArray)
                .pipe(
                    takeWhile(_ => this.alive),
                )
                .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.reloadData();
                    }
                });
        }
    }

    /**
     * Apply search filter
     * @param $event
     */
    onSearchFilterChanged($event) {
        // this.gridOptions.api.setQuickFilter($event.target.value);
        // this.gridOptions.api.onFilterChanged();
        this.updateDataFetcherOption(this.contactFilters.SEARCH, $event.target.value);
        this.setDataSource(this.dataFetcherParams);
    }

    private updateDataFetcherOption(optionName: ContactFilter, optionValue: any) {
        this.dataFetcherParams[optionName] = optionValue;
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

    get selectedRowIds() {
        return this.selectedRows && this.selectedRows.map(row => row.DocId);
    }

    deleteSelectedRows() {
        this.onDelete(this.selectedRowIds);
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    resetSelectionSingleOptionFilter(filters: IServerDropdownOption[]) {
        return filters.map(option => {
            option.selected = false;
            return option;
        });
    }

    addActions<IMainContact>(data: IMainContact[]): IMainContactGrid[] {
        return data.map((contact: any) => {
            contact.actions = [
                {
                    action: GridAction.VIEW,
                    idField: 'DocId',
                    url: `/Contacts/ContactDetails/${contact.DocId}`,
                },
                {
                    action: GridAction.EDIT,
                    idField: 'DocId',
                    url: `/Contacts/ContactUpdate/${contact.DocId}`,
                },
                {
                    action: GridAction.DELETE,
                    idField: 'DocId',
                    url: '',
                },
            ];

            return contact;
        });
    }

    reloadData() {
        this.gridOptions.api.purgeServerSideCache()
    }

    setDataSource(options: IContactDataFetcherParams = this.dataFetcherParams) { // searchValue: string = null
        const _that = this;
        const dataSource: IServerSideDatasource = {
            getRows: function (params) {
                // console.log('request params ', params);
                _that.previousRequestParams = params;
                // console.log('asking for ' + params.request.startRow + ' to ' + params.request.endRow);
                setTimeout(function () {

                    _that.contactsService.getAll({
                        perPage: params.request.endRow - params.request.startRow, // endRow - startRow gives perPage value
                        offset: params.request.startRow,
                        ...(options && options),
                    })
                        .pipe(
                            takeWhile(_ => _that.alive),
                        )
                        .subscribe((res: any) => {
                            // create and append grid actions to api result
                            const rowsThisPage = _that.addActions(res.Data);
                            params.successCallback(rowsThisPage, res.RowCount);
                        });

                }, 500);
            }
        };
        this.gridOptions.api.setServerSideDatasource(dataSource);
    }

    activeFilterUpdated(filterType: ContactFilter, filter: IServerDropdownOption, filterRemoved: boolean) {
        this.filtersSidebarContainer.filterComponents.forEach(filterComponent => {
            if (filterComponent.group === filterType) {
                filterComponent.filterChanged(filter, !filterRemoved);
            }
        })
    }
}
