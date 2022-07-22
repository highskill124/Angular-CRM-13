import {Component, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {TagService} from '../../../../services/tag.service';
import {Router} from '@angular/router';
import {TagEditComponent} from '../tag-edit/tag-edit.component';
import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {ToasterService} from 'angular2-toaster';
import {MatDialog} from '@angular/material/dialog';


@Component({
    selector: 'app-tag-grid',
    templateUrl: './tag-grid.component.html',
    styleUrls: ['./tag-grid.component.scss']
})
export class TagGridComponent {

    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    @ViewChild('filterGrid') filterGrid: FilterGridComponent;

    public config = {
        grid: GridColumnsListGuids.TAG_GRID,
        column: GridColumnsListGuids.TAG_GRID,
        filter: GridColumnsListGuids.TAG_GRID,


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
            {selected: ['any'], action: 'modal', label: 'Create New Tag', click: (data, params) => this.newTag(data, params)},
        ],

    };

    constructor(private tagService: TagService, private router: Router, private dialog: MatDialog, private toasterService: ToasterService) {

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
            const dialogRef = this.dialog.open(TagEditComponent,
                {
                data : { DocId: DocID, mode : 'edit'},
            disableClose: true, width: '600px', position : {
            top: '50px'
            },

    }

    );

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
                data: {
                    message: 'Are you sure you want to delete this record ?',
                    title: 'Delete can`t be undone',
                    rightbttntext: 'Try Again'
                },
                disableClose: true, width: '400px', position: {
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

    newTag(data, params) {

        const dialogRef = this.dialog.open(TagEditComponent,
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
        // return (param) => this.bucketService.getAllBuckets(param)
    }

    get dataFetcherMethod() {
        return (param) => this.tagService.getAllTags(param);
    }

    get dataExportMethod() {
        return (param) => this.tagService.fetchExportData(param);
    }


    reloadData() {
        this.filterGrid.reload()
    }

    deleteBucket(id: string) {
        console.log('Hitting componeted delete')
        this.tagService.delete(id).subscribe((res: any) => {
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadData()
            }
        })


    }
}
