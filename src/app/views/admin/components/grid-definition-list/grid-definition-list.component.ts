import { GridService } from './../../../../services/grid.service';
import {Component, Inject, Input, Optional, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {AdminService} from '../../../../services/admin.service';
import {Router} from '@angular/router';
// import { BucketEditComponent } from '../bucket-edit/bucket-edit.component';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {ToasterService} from 'angular2-toaster';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatDialogComponent } from '../../../../modules/mat-dialog/mat-dialog.component';
import { MenuService } from '../../../../services/menu.service';
import { GridColunEditorComponent } from '../grid-column-editor/grid-column-editor.component';



@Component({
    selector: 'app-grid-definition-list',
    templateUrl: './grid-definition-list.component.html',
    styleUrls: ['./grid-definition-list.component.scss']
})
export class GridDefinitionListComponent {

    @ViewChild('filterGrid') filterGrid: FilterGridComponent;
    @Input() showloading = false;
    @Input() hardReload = false;


    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    public config = {
        grid: GridColumnsListGuids.COLUMN_LIST_GRID,
        column: GridColumnsListGuids.COLUMN_LIST_GRID,
        filter: GridColumnsListGuids.COLUMN_LIST_GRID,


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
                callback: (data, params) => this.handleDelete('grid',data, params)
            },
            // {
            //     icon: 'up',
            //     color: 'red',
            //     class: 'custom-size',
            //     // isActive: false,
            //     callback: (data, params) => this.handleUp('grid',data, params)
            // },

        ],
        // configure plus actions
        plusActions: [
            // none, one, many, any
            // tslint:disable-next-line: max-line-length
            { selected: ['any'], action: 'modal', label: 'Create New User', click: (data, params) => this.newColumn(data, params) },
            // { selected: ['one'], action: 'modal', label: 'Edit Bucket', click: (data, params) => this.handleEdit('page', data, params) },
        ],

    };

    constructor(private adminService: AdminService,
        private gridService :GridService,
                private menuService : MenuService,
                private router: Router,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<GridColunEditorComponent >,
                @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
                private toasterService: ToasterService) {

    }

    reloadGrid() {
        return (param) => this.adminService.getGridColumns(param)
    }
    gridColumnList
    get dataFetcherMethod() {
        return (param) => this.adminService.getGridColumns(param)
    }


    reloadData() {
        this.filterGrid.reload()
    }

    handleEdit(grid, data, params) {
        console.log(this.filterGrid.activeFilters[0].value[0].value)
        const dialogRef = this.dialog.open(GridColunEditorComponent  ,
            {
              data: {DocId: data.DocId, ParentId: this.filterGrid.activeFilters[0].value[0].value,  mode: 'edit'},
              disableClose: false, width: '625px', position: {
                top: '50px'

              },
              panelClass:'no-pad-dialog',
            })
            dialogRef.afterClosed().subscribe(() => {response => console.log(response);
                console.log('We got an close request')
            });

            const sub = dialogRef.componentInstance.reloadGrid.subscribe(() => {
               this.reloadData()
    
            });

    }
    handleDelete(grid, data, params) {
        console.log(data)
        const dialogRef = this.dialog.open(MatDialogComponent,
            {
                data: {message: `Are you sure you want to delete the Column ${data.headerName} ?`, title: 'Delete can`t be undone', rightButtonText: 'No'},
                disableClose: true, width: '500px', position: {
                    top: '50px'
                },
                panelClass: 'no-pad-dialog',
                autoFocus: false
            })
        console.log('Will Delete Followup : ' + data.DocId)

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                console.log('Will DELETE THIS RECORD');
                this.deleteRecord(data.DocId)


            } else {
                console.log('Will not DELETE THIS RECORD');
            }
        });

    }

    handleUp(grid, data, params) {
        console.log(params.rowIndex)
    }

    newColumn(data, params){
        console.log(this.filterGrid.activeFilters[0].value[0].value)
        const dialogRef = this.dialog.open(GridColunEditorComponent ,
            {
                data: {DocId: '', ParentId: this.filterGrid.activeFilters[0].value[0].value, mode: 'new'},
                disableClose: true, width: '625px', position: {
                top: '50px'

              },
              panelClass:'no-pad-dialog',
            })
            dialogRef.afterClosed().subscribe(() => {
                console.log('We got an close request')
            });

            const sub = dialogRef.componentInstance.reloadGrid.subscribe(() => {
              //this.reloadData()
    
            });

    }

    deleteRecord(id: string) {
        this.gridService.delete(this.filterGrid.activeFilters[0].value[0].value, id).subscribe((res: any) => {
        
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadData()
            } else {
                this.toasterService.pop('error', res.Error);
            }
        })


    }





    }



