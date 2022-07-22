import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridColumnsListGuids } from '../../../../models/grid-columns-list-guids';
import { Router } from '@angular/router';
import { MatDialogComponent } from '../../../../modules/mat-dialog/mat-dialog.component';
import { FilterGridComponent } from '../../../filter-grid/components/filter-grid/filter-grid.component';
import { ToasterService } from 'angular2-toaster';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../../models/user';
import { NoteService } from '../../../../services/note.service';
import { sidebarColumnsCollapsed } from '../../../../modules/custom-ag-grid/sidebar-configurations/sidebar-columns-collapsed';
import { CreateNoteComponent } from '../../../notes/components/create-note/create-note.component';

@Component({
    selector: 'app-shared-notes',
    templateUrl: './shared-notes.component.html',
    styleUrls: ['./shared-notes.component.scss']
})
export class SharedNotesComponent implements OnInit, OnDestroy {
    private _contactId = '';

    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    @ViewChild('filterGrid') filterGrid: FilterGridComponent;
    @Input() gridtitle: String
    @Input() hideSelectOption = true;
    @Input() hideHiddenDisplay = true;
    @Input() showloading = false;
    @Input() hardReload = false;




    public config = {
        grid: GridColumnsListGuids.SHARED_NOTE_GRID,
        column: GridColumnsListGuids.SHARED_NOTE_GRID,
        filter: null,
        sideBarConfig: false,


        // remove the search options
        quickSearchTypeOption: null,

        // configure export
        exportFormats: null,

        // example to get csv and excel
        // [...dataExportFormats],

        // example to get csv
           // [{name: 'Export to CSV', value: 'csv', selected: false}],

        // examples to remove
        // [],
        // null,

        // configure actions
        actions: [

            {
                icon: 'edit',
                color: 'green',
                class: 'custom-size',

                callback: (data, params) => this.handleEdit('grid', data, params)
            },
            {
                icon: 'delete',
                color: 'red',
                class: 'custom-size',
                // isActive: false,
                callback: (data, params) => this.handleDelete(data, params)
            },

        ],
        // configure plus actions
        plusActions: [

            // tslint:disable-next-line: max-line-length
            {selected: ['any'], action: 'modal', label: 'Create New Note', click: (data, params) => this.handleNew(data, params)},
            //{selected: ['one'], action: 'modal', label: 'Edit FollowUp', click: (data, params) => this.handleEdit('page', data, params)},
        ],

    };

    thisUser: User;
    private _parent_id = '';
    @Input() set parent_id (parent_id: string) {
        this._parent_id = parent_id;
    }
    get parent_id() {
        return this._parent_id;
    }


    constructor(private noteService: NoteService,
                private router: Router,
                private dialog: MatDialog,
                private toasterService: ToasterService,
                private authService: AuthService)
                {
    }
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
        console.log('Parent ID : ' + this._parent_id)
    }

    handleEdit(mode, data, params) {
        let DocID: string
        if (mode === 'page') {
            console.log('Page Mode')
            console.log('Doc Key: ' + data.selectedRowIds[0])
            DocID = data.selectedRowIds[0]
        } else {
            DocID = data.DocId;
        }
        const dialogRef = this.dialog.open(CreateNoteComponent,
            {
                data: {DocId: DocID, mode: 'update'},
                disableClose: false, width: '900px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
                autoFocus: false

            });

        const sub = dialogRef.componentInstance.reloadGrid.subscribe(() => {
            console.log('We got an emit')
            this.reloadData()

        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('We got an unsubscribe')
        
        });
    }

    handleDelete(data, params) {
        const dialogRef = this.dialog.open(MatDialogComponent,
            {
                data: {message: 'Are you sure you want to delete this record ?', title: 'Delete can`t be undone', rightButtonText: 'No'},
                disableClose: true, width: '500px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
                autoFocus: false
            })
        console.log('Will Delete Followup : ' + data.DocId)

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                console.log('Will DELETE THIS RECORD');
                this.deleteRecord(data.DocId)
                this.reloadData()


            } else {
                console.log('Will not DELETE THIS RECORD');
            }
        });

    }

    handleNew(data, params) {

        const dialogRef = this.dialog.open(CreateNoteComponent,
            {
                data: {ParentId: this._parent_id, DocId: '', mode: 'new'},
                disableClose: false, width: '900px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
                autoFocus: false
            });
        const sub = dialogRef.componentInstance.reloadGrid.subscribe(() => {
            console.log('We got an emit')
            this.reloadData()

        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('We git an unsubscribe')
        });
    }

    reloadGrid() {
        return (param) => this.noteService.getAll(this._parent_id, param)
    }

    get dataFetcherMethod() {
        return (param) => this.noteService.getAll(this._parent_id, param);
    }

    get dataExportMethod() {
        return null
        // return (param) => this.bucketService.fetchExportData(param);
    }


    onViewActionClick(event) {
        this.router.navigateByUrl(`/Farm/FarmMaster/${event.docId}`, {
            state: {
                activeFilters: event.activeFilters,
                offset: event.grid.previousRequestParams.request.startRow,
            },
        });
    }

    reloadData() {
        this.filterGrid.reload()
    }

    deleteRecord(id: string) {
        this.noteService.delete(id).subscribe((res: any) => {
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadData()
            }
        })


    }
}
