import {Component, Inject, Input, Optional, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {AdminService} from '../../../../services/admin.service';
import {Router} from '@angular/router';
// import { BucketEditComponent } from '../bucket-edit/bucket-edit.component';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {ToasterService} from 'angular2-toaster';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MenuEditComponent} from '../menu-edit/menu-edit.component'
import { MatDialogComponent } from '../../../../modules/mat-dialog/mat-dialog.component';
import { MenuService } from '../../../../services/menu.service';


@Component({
    selector: 'app-menu-grid',
    templateUrl: './menu-grid.component.html',
    styleUrls: ['./menu-grid.component.scss']
})
export class MenuGridComponent {

    @ViewChild('filterGrid') filterGrid: FilterGridComponent;
    @Input() showloading = false;
    @Input() hardReload = false;


    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    public config = {
        grid: GridColumnsListGuids.MENU_GRID,
        column: GridColumnsListGuids.MENU_GRID,
        filter: null,


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


        ],
        // configure plus actions
        plusActions: [
            // none, one, many, any
            // tslint:disable-next-line: max-line-length
            { selected: ['any'], action: 'modal', label: 'Create New Menu Item', click: (data, params) => this.newMenuItem(data, params) },
            // { selected: ['one'], action: 'modal', label: 'Edit Bucket', click: (data, params) => this.handleEdit('page', data, params) },
        ],

    };

    constructor(private adminService: AdminService,
                private menuService : MenuService,
                private router: Router,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<MenuEditComponent>,
                @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
                private toasterService: ToasterService) {

    }

    reloadGrid() {
        return (param) => this.adminService.getAllMenus(param)
    }

    get dataFetcherMethod() {
        return (param) => this.adminService.getAllMenus(param);
    }


    reloadData() {
        this.filterGrid.reload()
    }

    handleEdit(grid, data, params) {
        const dialogRef = this.dialog.open(MenuEditComponent,
            {
              data: {DocId: data.DocId, mode: 'edit'},
              panelClass: 'my-custom-dialog-class',
              disableClose: true, width: '625px', position: {
                top: '50px'

              }
            })
            dialogRef.afterClosed().subscribe(() => {
                console.log('We got an close request')
            });

            const sub = dialogRef.componentInstance.reloadGrid.subscribe(() => {
                this.reloadData()
    
            });

    }
    handleDelete(grid, data, params) {
        const dialogRef = this.dialog.open(MatDialogComponent,
            {
                data: {message: `Are you sure you want to delete the Menu Item {{data.name}} ?`, title: 'Delete can`t be undone', rightButtonText: 'No'},
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

    newMenuItem(data, params){
        const dialogRef = this.dialog.open(MenuEditComponent,
            {
                data: {DocId: '', mode: 'new'},
                panelClass: 'my-custom-dialog-class',
                disableClose: true, width: '625px', position: {
                top: '50px'

              }
            })
            dialogRef.afterClosed().subscribe(() => {
                console.log('We got an close request')
            });

            const sub = dialogRef.componentInstance.reloadGrid.subscribe(() => {
                this.reloadData()
    
            });

    }

    deleteRecord(id: string) {
        this.menuService.deleteMenuItem(id).subscribe((res: any) => {
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadData()
            }
        })


    }





    }




