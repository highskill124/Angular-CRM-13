import {Component, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {Router} from '@angular/router';
import {CreateFollowUpComponent} from '../../../followups/components/create-followup/create-followup.component'

import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {ToasterService} from 'angular2-toaster';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../../models/user';
import { FollowupService } from '../../../../services/followup.service';
import { DropdownGuids } from '../../../../models/dropdown-guids.enum';


@Component({
    selector: 'app-my-followups',
    templateUrl: './my-followups.component.html',
    styleUrls: ['./my-followups.component.scss']
})
export class MyFollowupsComponent  {
    private _contactId = '';
    guids = DropdownGuids;

    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    @ViewChild('filterGrid') filterGrid: FilterGridComponent;


    quickSelectDataId: string = this.guids.FOLLUP_QUICKSELECT

    public config = {
        grid: GridColumnsListGuids.FOLLOWUP_GRID,
        column: GridColumnsListGuids.FOLLOWUP_GRID,
        filter: this.guids.FOLLUP_QUICKSELECT,


        // remove the search options
        quickSearchTypeOption: null,

        // configure export
        exportFormats:

        // example to get csv and excel
        // [...dataExportFormats],

        // example to get csv
            [{name: 'Export to CSV', value: 'csv', selected: false}],

        // configure actions
        actions: [

            {
                icon: 'edit',
                color: 'green',
                class: 'custom-size',

                callback: (data, params) => this.handleEdit('grid', data, params)
            },
            {
                icon: 'search',
                color: 'blue',
                class: 'custom-size',

                callback: (data, params) => this.handleView('grid', data, params)
            },
            {
                icon: 'check',
                color: 'green',
                class: 'custom-size',
                // isActive: false,
                callback: (data, params) => this.handleComplete(data, params)
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
        plusActions:
           [
           // tslint:disable-next-line: max-line-length
           // {selected: ['any'], action: 'modal', label: 'Create New Followup', click: (data, params) => this.handleNew(data, params)},
           // {selected: ['one'], action: 'modal', label: 'Edit Followup', click: (data, params) => this.handleEdit('page', data, params)},
           ],

    };

    thisUser: User;


    constructor(private followupService: FollowupService,
                private router: Router,
                private dialog: MatDialog,
                private toasterService: ToasterService,
                private authService: AuthService) {

                    this.thisUser = this.authService.getStoredUser();
    }

    // Edit Selected Item via Modal Dialog
    handleEdit(mode, data, params) {
        let DocID: string
        if (mode === 'page') {
            DocID = data.selectedRowIds[0]
        } else {
            DocID = data.DocId;
        }
        const dialogRef = this.dialog.open(CreateFollowUpComponent,
            {
                data: {DocId: DocID, mode: 'update'},
                disableClose: true, width: '700px', position: {
                    top: '50px'
                },
                panelClass: 'no-pad-dialog',
            });

        const sub = dialogRef.componentInstance.reloadGrid.subscribe(() => {
            this.reloadData()

        });

        dialogRef.afterClosed().subscribe(() => {
        });
    }

    // Delete selected Item
    handleDelete(data, params) {
        const dialogRef = this.dialog.open(MatDialogComponent,
            {
                data: {message: 'Are you sure you want to delete this record ?', title: 'Delete can`t be undone', rightButtonText: 'No'},
                disableClose: true, width: '500px', position: {
                    top: '50px'
                },
                panelClass: 'no-pad-dialog',
                autoFocus: false
            })
        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {

                console.log(data)
                this.deleteFollowup(data.DocId)

            } else {

            }
        });

    }

    handleComplete(data, params) {

        this.followupService.complete(data.DocId).subscribe((res: any) => {
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadData()
            } else {
            this.toasterService.pop('error', 'Error!', res.Message);
         }
        })

    }

    handleView(mode, data, params) {
        console.log(data)
        if (data.prefix === 'contact') {
            console.log('will show Contact')
            this.router.navigate(['/Contacts/ContactDetails', data.parent_id]);



        } else if (data.prefix === 'farm') {

            this.router.navigateByUrl(`/Farm/FarmMaster/${data.parent_id}`)

        }



    }

    reloadGrid() {
        console.log('Reloading Grid')
        return (param) => this.followupService.getAllUser( param, false)
    }

    get dataFetcherMethod() {
        return (param) => this.followupService.getAllUser( param, false);
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

    deleteFollowup(id: string) {
        this.followupService.delete(id).subscribe((res: any) => {
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadData()
            } else {
            this.toasterService.pop('error', 'Error!', res.Message);
         }
        })

    }
}
