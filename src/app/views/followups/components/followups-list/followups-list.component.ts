import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IGridDataFetcherParams} from '../../../../modules/custom-ag-grid/ag-grid-base';
import {filter, map, switchMap, take, takeWhile, tap} from 'rxjs/operators';
import {ColDef, IServerSideGetRowsParams} from 'ag-grid-community';
import {IApiResponseBody} from '../../../../models/api-response-body';
import {ActionsRendererComponent} from '../../../../modules/custom-ag-grid/components/actions-renderer/actions-renderer.component';
import {DialogService} from '../../../../services/dialog.service';
import {ModalAddFollowupComponent} from '../modal-add-followup/modal-add-followup.component';
import {IFollowUp} from '../../../../models/follow-up';
import {FollowupService} from '../../../../services/followup.service';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {Observable} from 'rxjs';
import {IGridColumnAgGrid} from '../../../../models/grid-column';
import {GridColumnsService} from '../../../../services/grid-columns.service';
import {FormOperation} from '../../../../models/form-operation';
import {IAgGridBaseParent} from '../../../../models/ag-grid-base-parent';
import {AgGridBaseComponent} from '../../../../modules/custom-ag-grid/components/ag-grid-base/ag-grid-base.component';
import {sidebarColumnsCollapsed} from '../../../../modules/custom-ag-grid/sidebar-configurations/sidebar-columns-collapsed';
import {GridDataFetcherFactoryFunc} from '../../../../types/grid-data-fetcher-factory-func';
import {addGridActions} from '../../../../helpers/add-grid-actions';

@Component({
    selector: 'app-followups-list',
    templateUrl: './followups-list.component.html',
    styleUrls: ['./followups-list.component.scss']
})
export class FollowupsListComponent implements OnInit, OnDestroy, IAgGridBaseParent {

    sideBar = sidebarColumnsCollapsed;
    alive = true;

    gridGuid = GridColumnsListGuids.FOLLOWUP_GRID;
    columnsList$: Observable<IGridColumnAgGrid[]>;
    columnsList: IGridColumnAgGrid[] = [];
    supplementaryColumnDefs: ColDef[];

    dataFetcherFactory: GridDataFetcherFactoryFunc;

    private _parent_id = '';

    @Input() theme = 'ag-theme-material';
    @Input() addParentIdToRequest = true;

    @ViewChild('agGridBase', {read: AgGridBaseComponent})
    public agGridBase: AgGridBaseComponent;
    @Input() set parent_id(parent_id: string) {
        this._parent_id = parent_id;
    }
    get parent_id() {
        return this._parent_id;
    }

    constructor(
        private cdRef: ChangeDetectorRef,
        private dialogService: DialogService,
        private columnsService: GridColumnsService,
        private followupService: FollowupService,
    ) {
        this.fetchColumnsList();
    }

    ngOnInit() {
        this.setDataFetcherFactory();
    }

    fetchColumnsList(gridGuid = this.gridGuid) {
        this.columnsList$ = this.columnsService.fetchColumnsAgGrid(gridGuid)
            .pipe(
                // @TODO: Remove this filter when columns fetch endpoint for followups is fixed
                // filter(columns => !!(columns && columns.length)),
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
            return this.followupService.getAll(
                this.addParentIdToRequest ? this.parent_id : null,
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
                        const rowsThisPage = addGridActions<IFollowUp>(res.Data);

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

    onDelete(DocId: string) {
        if (confirm('Delete followup?')) {
            this.followupService.delete(DocId).pipe(
                takeWhile(_ => this.alive),
                take(1),
            )
                .subscribe((res: any) => {
                    if (res.Success) {
                        this.agGridBase.reloadData();
                    }
                });
        }
    }

    openDialog(params: { DocId?: string, formOperation: FormOperation }) {
        this.followupService.fetch(params.DocId)
            .pipe(
                takeWhile(_ => this.alive),
                filter(followup => !!(followup && followup.DocId)),
                take(1),
                switchMap(followup => {
                    return this.dialogService.open<ModalAddFollowupComponent>({component: ModalAddFollowupComponent})
                        .pipe(
                            // Prevent dialog service from re-using this instance
                            take(1),
                            map(dialogInstance => {
                                return {
                                    dialogInstance,
                                    followup,
                                };
                            }),
                        )
                }),
                switchMap(res => {
                    res.dialogInstance.componentInstance.formOperation = params.formOperation;
                    res.dialogInstance.componentInstance.parentid = this.parent_id;
                    res.dialogInstance.componentInstance.formData = res.followup;

                    return res.dialogInstance.componentInstance.onDismiss.pipe(
                        tap(_ => {
                            res.dialogInstance.dialogService.overlayService.hide(res.dialogInstance.overlayId);
                        })
                    );
                })
            )
            .subscribe($dismissEvent => {
                if ((typeof $dismissEvent !== 'boolean') && $dismissEvent.parent_id) {
                    // Reload followups list when new followup is submitted
                    this.agGridBase && this.agGridBase.reloadData();
                }
            });
    }
}
