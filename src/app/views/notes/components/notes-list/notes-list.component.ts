import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AgGridBase} from '../../../../modules/custom-ag-grid/ag-grid-base';
import {switchMap, take, takeWhile, tap} from 'rxjs/operators';
import {GridOptions, IServerSideDatasource} from 'ag-grid-community';
import {NoteService} from '../../../../services/note.service';
import {IApiResponseBody} from '../../../../models/api-response-body';
import {IBaseNote} from '../../../../models/base-note';
import {ActionsRendererComponent} from '../../../../modules/custom-ag-grid/components/actions-renderer/actions-renderer.component';
import {DialogService} from '../../../../services/dialog.service';
import {ModalAddNoteComponent} from '../modal-add-note/modal-add-note.component';
import {FormOperation} from '../../../../models/form-operation';

@Component({
    selector: 'app-notes-list',
    templateUrl: './notes-list.component.html',
    styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent extends AgGridBase implements OnInit, OnDestroy {

    rowModelType = 'serverSide';
    cacheBlockSize = 100;
    maxBlocksInCache = 10;
    alive = true;

    private _contactId = '';
    @Input() set contactId(contactId: string) {
        this._contactId = contactId;
    };

    get contactId() {
        return this._contactId;
    }

    constructor(
        private cdRef: ChangeDetectorRef,
        private dialogService: DialogService,
        private notesService: NoteService,
    ) {
        super();
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
                tooltipComponent: 'customTooltip',
            },
            /**
             * @see https://github.com/ag-grid/ag-grid-angular/issues/121
             */
            isExternalFilterPresent: this.isExternalFilterPresent.bind(this),
            doesExternalFilterPass: this.doesExternalFilterPass.bind(this)
        };
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
                headerName: 'Subject',
                field: 'subject',
                // width: 100,
                // pinned: true,
                sortable: false,
                suppressMenu: true,
            },
            {
                headerName: 'Notes',
                field: 'notes',
                // width: 100,
                // pinned: true,
                sortable: false,
                suppressMenu: true,
            },
            {
                headerName: 'Created by',
                field: 'created_by',
                // width: 50,
                // pinned: true,
                sortable: false,
                suppressMenu: true,
            },
            {
                headerName: 'Created on',
                field: 'created_on',
                // width: 50,
                // pinned: true,
                sortable: false,
                suppressMenu: true,
                cellRenderer: (data) => {
                    return data.value ? (new Date(data.value)).toLocaleDateString() + ' ' + (new Date(data.value)).toLocaleTimeString() : '';
                },
            },
            {
                headerName: 'Actions',
                width: 130,
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

                    _that.notesService.getAll(_that.contactId, {
                        perPage: params.request.endRow - params.request.startRow, // endRow - startRow gives perPage value
                        offset: params.request.startRow,
                    })
                        .pipe(
                            takeWhile(_ => _that.alive),
                        )
                        .subscribe((res: IApiResponseBody) => {

                            // create and append grid actions to api result
                            const rowsWithActions = _that.addActions<IBaseNote>(res.Data);
                            params.successCallback(rowsWithActions, res.RowCount);
                        });

                }, 500);
            }
        };
        this.gridOptions.api.setServerSideDatasource(dataSource);
    }

    onView(DocId: string) {
        const node = this.api.getRowNode(DocId);
        if (node) {
            this.openDialog({note: node.data, formOperation: 'view'});
        } else {
            /**
             * TODO: Move this functionality to dedicated service
             * The service should take care of displaying these only in dev environment
             */
            console.warn('Note node not found in grid');
        }
    }

    onEdit(DocId: string) {
        const node = this.api.getRowNode(DocId);
        if (node) {
            this.openDialog({note: node.data, formOperation: 'update'});
        } else {
            /**
             * TODO: Move this functionality to dedicated service
             * The service should take care of displaying these only in dev environment
             */
            console.warn('Note node not found in grid');
        }
    }

    onDelete(DocId: string) {
        if (confirm('Delete note?')) {
            this.notesService.delete(DocId).pipe(
                takeWhile(_ => this.alive),
                take(1),
            )
                .subscribe((res: any) => {
                    if (res.Success) {
                        this.reloadData();
                    }
                });
        }
    }

    openDialog(params: { note?: IBaseNote, formOperation: FormOperation }) {
        this.dialogService.open<ModalAddNoteComponent>({component: ModalAddNoteComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(res => {
                    res.componentInstance.formOperation = params.formOperation;
                    res.componentInstance.parentid = this.contactId;
                    res.componentInstance.note = params.note;

                    return res.componentInstance.onDismiss.pipe(
                        tap(_ => {
                            res.dialogService.overlayService.hide(res.overlayId);
                        })
                    );
                })
            )
            .subscribe($dismissEvent => {
                if ((typeof $dismissEvent !== 'boolean') && $dismissEvent.parentid) {
                    // Reload interactions list when new interaction is submitted
                    this.reloadData();
                }
            });
    }
}
