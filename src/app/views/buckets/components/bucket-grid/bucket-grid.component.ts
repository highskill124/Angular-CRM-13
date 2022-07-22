import {Component, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {BucketService} from '../../../../services/bucket.service';
import {Router} from '@angular/router';
import {BucketEditComponent} from '../bucket-edit/bucket-edit.component';
import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {ToasterService} from 'angular2-toaster';
import {MatDialog} from '@angular/material/dialog';


@Component({
    selector: 'app-bucket-grid',
    templateUrl: './bucket-grid.component.html',
    styleUrls: ['./bucket-grid.component.scss']
})
export class BucketGridComponent {

    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    @ViewChild('filterGrid') filterGrid: FilterGridComponent;

    public config = {
        grid: GridColumnsListGuids.BUCKET_GRID,
        column: GridColumnsListGuids.BUCKET_GRID,
        filter: GridColumnsListGuids.BUCKET_GRID,


        // remove the search options
        quickSearchTypeOption: null,

        // configure export
        exportFormats:

        // example to get csv and excel
        // [...dataExportFormats],

        // example to get csv
            [{name: 'Export to CSV', value: 'csv', selected: false}],

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
            // none, one, many, any
            // { selected: ['one', 'many'], action: 'add-interaction-action' },
            // { selected: ['one', 'many'], action: 'action-add-note' },
            // { selected: ['one', 'many'], action: 'action-add-task' },
            // { selected: ['one', 'many'], action: 'action-add-followup' },
            // { selected: ['one', 'many'], action: 'action-add-phone-number' },
            // { selected: ['one', 'many'], action: 'action-action-add-email' },
            // { selected: ['one', 'many'], action: 'bucket-action' },

            // tslint:disable-next-line: max-line-length
            {selected: ['any'], action: 'modal', label: 'Create New Bucket', click: (data, params) => this.newBucket(data, params)},
            {selected: ['one'], action: 'modal', label: 'Edit Bucket', click: (data, params) => this.handleEdit('page', data, params)},
        ],

    };

    constructor(private bucketService: BucketService,
                private router: Router,
                private dialog: MatDialog,
                private toasterService: ToasterService) {

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
        const dialogRef = this.dialog.open(BucketEditComponent,
            {
                data: {DocId: DocID, mode: 'edit'},
                disableClose: false, width: '600px', position: {
                    top: '50px'
                },

            });

        const sub = dialogRef.componentInstance.reloadGrid.subscribe(() => {
            console.log('We got an emit')
            this.reloadData()

        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('We git an unsubscribe')
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
        console.log('Will Delete Bucket ' + data.DocId)

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                console.log('Will DELETE THIS RECORD');
                this.deleteBucket(data.DocId)


            } else {
                console.log('Will not DELETE THIS RECORD');
            }
        });

    }

    newBucket(data, params) {

        const dialogRef = this.dialog.open(BucketEditComponent,
            {
                data: {DocId: '', mode: 'new'},
                disableClose: false, width: '600px', position: {
                    top: '50px'
                },
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
        return (param) => this.bucketService.getAllBuckets(param)
    }

    get dataFetcherMethod() {
        return (param) => this.bucketService.getAllBuckets(param);
    }

    get dataExportMethod() {
        return (param) => this.bucketService.fetchExportData(param);
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

    deleteBucket(id: string) {
        this.bucketService.delete(id).subscribe((res: any) => {
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadData()
            }
        })


    }
}
