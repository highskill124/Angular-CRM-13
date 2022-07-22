import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IGridDataFetcherParams} from '../../../../modules/custom-ag-grid/ag-grid-base';
import {filter, map, switchMap, take, takeWhile, tap} from 'rxjs/operators';
import {ColDef, IServerSideGetRowsParams} from 'ag-grid-community';
import {IApiResponseBody} from '../../../../models/api-response-body';
import {IBaseNote} from '../../../../models/base-note';
import {ActionsRendererComponent} from '../../../../modules/custom-ag-grid/components/actions-renderer/actions-renderer.component';
import {DialogService} from '../../../../services/dialog.service';
import {FormOperation} from '../../../../models/form-operation';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {IGridColumnAgGrid} from '../../../../models/grid-column';
import {Observable} from 'rxjs';
import {GridColumnsService} from '../../../../services/grid-columns.service';
import {AgGridBaseComponent} from '../../../../modules/custom-ag-grid/components/ag-grid-base/ag-grid-base.component';
import {sidebarColumnsCollapsed} from '../../../../modules/custom-ag-grid/sidebar-configurations/sidebar-columns-collapsed';
import {addGridActions} from '../../../../helpers/add-grid-actions';
import {GridDataFetcherFactoryFunc} from '../../../../types/grid-data-fetcher-factory-func';
import {IAgGridBaseParent} from '../../../../models/ag-grid-base-parent';
import {ModalAddPhoneNumberComponent} from '../modal-add-phone-number/modal-add-phone-number.component';
import {PhoneNumberService} from '../../../../services/phone-number.service';

@Component({
    selector: 'app-phone-numbers-list',
    templateUrl: './phone-numbers-list.component.html',
    styleUrls: ['./phone-numbers-list.component.scss']
})
export class PhoneNumbersListComponent implements OnInit, OnDestroy, IAgGridBaseParent {
;

    sideBar = sidebarColumnsCollapsed;
    alive = true;

    gridGuid = GridColumnsListGuids.TASK_GRID;
    columnsList$: Observable<IGridColumnAgGrid[]>;
    columnsList: IGridColumnAgGrid[] = [];
    supplementaryColumnDefs: ColDef[];

    dataFetcherFactory: GridDataFetcherFactoryFunc;

    private _contactId = '';

    @Input() theme = 'ag-theme-balham';
    @Input() useContactId = true;

    @ViewChild('agGridBase', {read: AgGridBaseComponent})
    public agGridBase: AgGridBaseComponent;
    @Input() set contactId(contactId: string) {
        this._contactId = contactId;
    }
    get contactId() {
        return this._contactId;
    }

    constructor(
        private cdRef: ChangeDetectorRef,
        private dialogService: DialogService,
        private columnsService: GridColumnsService,
        private phoneNumberService: PhoneNumberService,
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

        this.supplementaryColumnDefs = [
            {
                headerName: 'Actions',
                width: 130,
                sortable: false,
                suppressMenu: true,
                cellRendererFramework: ActionsRendererComponent,
                pinned: 'right',
            },
        ];
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
            return this.phoneNumberService.getAll(
                this.useContactId ? this.contactId : null,
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
                    // qsearch: fetcherParams && fetcherParams.qsearch,
                }
            )
                .pipe(
                    map((res: IApiResponseBody) => {
                        const rowsThisPage = addGridActions<IBaseNote>(res.Data);

                        return {
                            rowsThisPage,
                            totalRowCount: res.RowCount,
                        };
                    }),
                );
        };
    }

    onView(DocId: string) {
        this.openDialog({DocId, formOperation: 'view'});
    }

    onEdit(DocId: string) {
        this.openDialog({DocId, formOperation: 'update'});
    }

    onDelete(DocId: string | Array<string>) {
    }

    openDialog(params: { DocId: string, formOperation: FormOperation }) {
        this.phoneNumberService.fetch(params.DocId)
            .pipe(
                takeWhile(_ => this.alive),
                filter(phoneNumber => !!(phoneNumber && phoneNumber.id)),
                take(1),
                switchMap(phoneNumber => {
                    return this.dialogService.open<ModalAddPhoneNumberComponent>({component: ModalAddPhoneNumberComponent})
                        .pipe(
                            // Prevent dialog service from re-using this instance
                            take(1),
                            map(dialogInstance => {
                                return {
                                    dialogInstance,
                                    phoneNumber,
                                };
                            }),
                        )
                }),
                switchMap(res => {
                    res.dialogInstance.componentInstance.formOperation = params.formOperation;
                    res.dialogInstance.componentInstance.parentId = this.contactId;
                    res.dialogInstance.componentInstance.phoneNumber = res.phoneNumber;

                    return res.dialogInstance.componentInstance.onDismiss.pipe(
                        tap(_ => {
                            res.dialogInstance.dialogService.overlayService.hide(res.dialogInstance.overlayId);
                        })
                    );
                })
            )
            .subscribe($dismissEvent => {
                if ((typeof $dismissEvent !== 'boolean') && $dismissEvent.parentId) {
                    // Reload interactions list when new interaction is submitted
                    this.agGridBase.reloadData();
                }
            });
    }
}
