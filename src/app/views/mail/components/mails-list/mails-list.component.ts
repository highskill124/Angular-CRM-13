import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AgGridBase} from '../../../../modules/custom-ag-grid/ag-grid-base';
import {takeWhile} from 'rxjs/operators';
import {GridOptions, IServerSideDatasource} from 'ag-grid-community';
import {sortAndFilter} from '../../../../models/ag-grid';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {GridAction} from '../../../../models/grid';
import {IMail} from '../../../../models/mail';
import {MultiKeyValueItemRendererComponent} from '../../../../modules/custom-ag-grid/components/multi-key-value-item-renderer/multi-key-value-item-renderer.component';
import {BucketsTooltipRenderer} from '../../../../modules/custom-ag-grid/render-functions/tooltip-renderers';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {ActionsRendererComponent} from '../../../../modules/custom-ag-grid/components/actions-renderer/actions-renderer.component';
import {TemplateRendererComponent} from '../../../../modules/custom-ag-grid/components/template-renderer/template-renderer.component';
import {MailService} from '../../../../services/mail.service';

@Component({
    selector: 'app-mails-list',
    templateUrl: './mails-list.component.html',
    styleUrls: ['./mails-list.component.scss']
})
export class MailsListComponent extends AgGridBase implements OnInit, AfterViewInit, OnDestroy {

    rowModelType = 'serverSide';
    cacheBlockSize = 100;
    maxBlocksInCache = 10;
    alive = true;

    private _contactId = '';

    @ViewChild('notifyCell') notifyCell: TemplateRef<any>;

    @Input() set contactId(contactId: string) {
        this._contactId = contactId;
    }

    get contactId() {
        return this._contactId;
    }

    constructor(
        private cdRef: ChangeDetectorRef,
        private contactsService: ContactsService,
        private mailService: MailService,
    ) {
        super();
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
            },
            /**
             * @see https://github.com/ag-grid/ag-grid-angular/issues/121
             */
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this)
        };
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.createColumnDefs();
        }, 500);
    }

    public onReady($event) {
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
                headerName: 'Send To',
                field: 'to',
                // width: 100,
                // pinned: true,
                sortable: false,
                suppressMenu: true,
                valueGetter: (params) => {
                    const transformed: IServerDropdownOption[] = [];
                    if (params.data && params.data.to) {
                        params.data.to.forEach(to => {
                            transformed.push({
                                name: to,
                                value: to,
                                selected: true,
                            })
                        });
                    }

                    return transformed;
                },
                cellRendererFramework: MultiKeyValueItemRendererComponent,
                cellRendererParams: {
                    showValue: 'no',
                    hasClickAction: false,
                    tooltipRenderer: BucketsTooltipRenderer,
                },
                /*cellRenderer: (params) => {
                    if (Array.isArray(params.value)) {
                        return params.value.join(', ');
                    }

                    return params.value;
                },*/
            },
            {
                headerName: 'Notify',
                colId: 'notify',
                cellRendererFramework: TemplateRendererComponent,
                cellRendererParams: {
                    ngTemplate: this.notifyCell,
                }
            },
            {
                headerName: 'Subject',
                field: 'subject',
                // width: 100,
                // pinned: true,
                sortable: false,
                suppressMenu: true,
            },
            {
                headerName: 'Track',
                width: 100,
                // pinned: true,
                sortable: false,
                suppressMenu: true,
                valueGetter: (params) => {
                    if (params.data) {
                        return params.data.msg_count + ' | ' + params.data.click_count;
                    }

                    return null;
                },
            },
            {
                headerName: 'Send On',
                field: 'send_datetime',
                // width: 100,
                // pinned: true,
                sortable: false,
                suppressMenu: true,
                cellRenderer: (params) => {
                    return params.value ? (new Date(params.value)).toLocaleDateString() + ' ' + (new Date(params.value)).toLocaleTimeString() : '';
                },
            },
            {
                headerName: 'Actions',
                width: 100,
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

    onView(DocId: string) {
        /*const node = this.api.getRowNode(DocId);
        if (node) {
            this.openDialog({note: node.data});
        } else {
            /!**
             * TODO: Move this functionality to dedicated service
             * The service should take care of displaying these only in dev environment
             *!/
            console.warn('Note node not found in grid');
        }*/
    }

    greet(row: any) {
        alert(`${row.country} says "${row.greeting}!`);
    }

    onTracking(DocId: string) {
        //
    }

    get selectedRowIds() {
        return this.selectedRows && this.selectedRows.map(row => row.DocId);
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    reloadData() {
        this.gridOptions.api.purgeServerSideCache()
    }

    setDataSource() { // searchValue: string = null
        const _that = this;
        const dataSource: IServerSideDatasource = {
            getRows: function (params) {
                // console.log('request params ', params);
                _that.previousRequestParams = params;
                // console.log('asking for ' + params.request.startRow + ' to ' + params.request.endRow);
                setTimeout(function () {

                    _that.contactsService.emailsList(_that.contactId, {
                        perPage: params.request.endRow - params.request.startRow, // endRow - startRow gives perPage value
                        offset: params.request.startRow,
                    })
                        .pipe(
                            takeWhile(_ => _that.alive),
                        )
                        .subscribe(res => {
                            // apply sort and filter
                            const dataAfterSortingAndFiltering = sortAndFilter(
                                res.Data,
                                params.request.sortModel,
                                params.request.filterModel,
                            );
                            // create and append grid actions to api result
                            const rowsThisPage = _that.addActions(dataAfterSortingAndFiltering);
                            params.successCallback(rowsThisPage, res.RowCount);
                        });

                }, 500);
            }
        };
        this.gridOptions.api.setServerSideDatasource(dataSource);
    }

    addActions<IMail>(mails: IMail[]) {
        /**
         * TODO: Properly type mail param in map() callback
         */
        return mails.map((mail: any) => {
            mail.actions = [
                {
                    action: GridAction.VIEW,
                    idField: 'DocId',
                    url: ``,
                },
                {
                    action: GridAction.TRACKING,
                    idField: 'DocId',
                    url: ``,
                },
            ];

            return mail;
        });
    }

    updateNotifyStatus(row: IMail) {
        // update notify status by reversing
        row.notify = !row.notify;
        this.mailService.updateNotifyStatusForTrackRequest({trackRequestId: row.DocId, newNotifyState: row.notify})
            .subscribe(
                (res) => {
                },
                (error) => {
                    // revert notify status on error
                    row.notify = !row.notify;
                }
            )
    }
}
