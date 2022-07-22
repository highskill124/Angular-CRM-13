import {Component, Inject, Input, Optional, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {AdminService} from '../../../../services/admin.service';
import {Router} from '@angular/router';
// import { BucketEditComponent } from '../bucket-edit/bucket-edit.component';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {ToasterService} from 'angular2-toaster';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UserQuickEditComponent } from '../user-quick-edit/user-quick-edit.component'
import { MatDialogComponent } from '../../../../modules/mat-dialog/mat-dialog.component';
import { MenuService } from '../../../../services/menu.service';


@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

    @ViewChild('filterGrid') filterGrid: FilterGridComponent;
    @Input() showloading = false;
    @Input() hardReload = false;


    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    public config = {
        grid: GridColumnsListGuids.USER_LIST_GRID,
        column: GridColumnsListGuids.USER_LIST_GRID,
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
            { selected: ['any'], action: 'modal', label: 'Create New User', click: (data, params) => this.newMenuItem(data, params) },
            // { selected: ['one'], action: 'modal', label: 'Edit Bucket', click: (data, params) => this.handleEdit('page', data, params) },
        ],

    };

    constructor(private adminService: AdminService,
                private menuService : MenuService,
                private router: Router,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<UserQuickEditComponent>,
                @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
                private toasterService: ToasterService) {

    }

    reloadGrid() {
        return (param) => this.adminService.getListOfAllUserHistory(param)
    }

    get dataFetcherMethod() {
        return (param) => this.adminService.getListOfAllUserHistory(param)
    }


    reloadData() {
        this.filterGrid.reload()
    }

    handleEdit(grid, data, params) {
        console.log(data)
        const dialogRef = this.dialog.open(UserQuickEditComponent ,
            {
              data: {DocId: data.DocId, mode: 'edit'},
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
                data: {message: `Are you sure you want to delete the User Account ${data.username} ?`, title: 'Delete can`t be undone', rightButtonText: 'No'},
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
        const dialogRef = this.dialog.open(UserQuickEditComponent,
            {
                data: {DocId: '', mode: 'new'},
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
        this.adminService.deleteUserAccount(id).subscribe((res: any) => {
        
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadData()
            } else {
                this.toasterService.pop('error', res.Error);
            }
        })


    }





    }



