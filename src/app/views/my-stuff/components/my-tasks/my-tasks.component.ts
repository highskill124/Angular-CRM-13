import {Component, Input, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {TaskService} from '../../../../services/task.service';
import {Router} from '@angular/router';
import {CreateTaskComponent} from '../../../tasks/components/create-task/create-task.component';
import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {ToasterService} from 'angular2-toaster';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../../models/user';


@Component({
    selector: 'app-my-tasks',
    templateUrl: './my-tasks.component.html',
    styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent {
    private _contactId = '';

    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    @ViewChild('filterGrid') filterGrid: FilterGridComponent;




    public config = {
        grid: GridColumnsListGuids.TASK_GRID,
        column: GridColumnsListGuids.TASK_GRID,
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

    thisUser: User;
   

    constructor(private taskService: TaskService,
                private router: Router,
                private dialog: MatDialog,
                private toasterService: ToasterService,
                private authService: AuthService)
                {
        
                    this.thisUser = this.authService.getStoredUser();
    }

    handleEdit(mode, data, params) {
        console.log('This is a Edit')
        let DocID: string
        if (mode === 'page') {
            console.log('Page Mode')
            console.log('Doc Key: ' + data.selectedRowIds[0])
            DocID = data.selectedRowIds[0]
        } else {
            console.log(data.DocId)
            DocID = data.DocId;
        }
        const dialogRef = this.dialog.open(CreateTaskComponent,
            {
                data: {DocId: DocID, mode: 'update'},
                disableClose: false, width: '800px', position: {
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

        const dialogRef = this.dialog.open(CreateTaskComponent,
            {
                data: {DocId: '', mode: 'new'},
                disableClose: false, width: '800px', position: {
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
        return (param) => this.taskService.getAll(null , param)
    }

    get dataFetcherMethod() {
        return (param) => this.taskService.getAll( null, param);
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

    deleteBucket(id: string) {
        this.taskService.delete(id).subscribe((res: any) => {
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadData()
            }
        })


    }
}


// import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
// import {first} from 'rxjs/operators';
// import {isObservable, Observable} from 'rxjs';
// import {IServerDropdownOption} from '../../../../models/server-dropdown';
// import {MessageTrackingFilter} from '../../../../enums/message-tracking-filter.enum';
// import {
//     IMessageTrackingFilterResult,
//     MessageTrackingFiltersSidebarComponent
// } from '../filters-sidebar/message-tracking-filters-sidebar.component';
// import {User} from '../../../../models/user';
// import {AuthService} from '../../../../services/auth.service';
// import {TasksListComponent} from '../../../tasks/components/tasks-list/tasks-list.component';

// @Component({
//     selector: 'app-my-tasks',
//     templateUrl: './my-tasks.component.html',
//     styleUrls: ['./my-tasks.component.scss']
// })
// export class MyTasksComponent implements OnInit, OnDestroy {

//     filters = MessageTrackingFilter;
//     activeFilters: IMessageTrackingFilterResult = {};

//     alive = true;

//     loggedInUser$: Observable<User>;

//     @ViewChild('filterSidebar', {read: MessageTrackingFiltersSidebarComponent})
//     public filterSidebar: MessageTrackingFiltersSidebarComponent;

//     @ViewChild('tasksList', {read: TasksListComponent})
//     public tasksList: TasksListComponent;

//     constructor(
//         private authService: AuthService,
//     ) {
//         this.loggedInUser$ = this.authService.getCurrentUser();
//     }

//     ngOnInit() {
//     }

//     ngOnDestroy(): void {
//         this.alive = false;
//     }

//     get agGridBase() {
//         return this.tasksList && this.tasksList.agGridBase;
//     }

//     private setActiveFilters(filters: IMessageTrackingFilterResult) {
//         this.activeFilters = filters;
//         // this.cdRef.detectChanges(); // Avoid expression changed after it was checked error
//     }

//     onSideBarFilter($event: IMessageTrackingFilterResult) {

//         // Make sure grid has been initialized before trying to update the datasource
//         if (this.agGridBase && this.agGridBase.api) {
//             this.setActiveFilters($event);

//             // update data fetcher options
//             for (const key in $event) {
//                 if ($event.hasOwnProperty(key)) {

//                     const filter: MessageTrackingFilter = <MessageTrackingFilter>key;
//                     const filterValues = <IServerDropdownOption[]>$event[filter];
//                     this.agGridBase.updateDataFetcherParam(filter, filterValues.map(filterValue => filterValue.value));
//                 }
//             }

//             this.tasksList.setDataFetcherFactory(this.agGridBase.getDataFetcherParams());
//         }
//     }

//     activeFilterRemoved(filterType: MessageTrackingFilter, changedFilter: IServerDropdownOption) {
//         // construct the observable name as is in the filter sidebar component
//         const sidebarObservableName = `${filterType}Options$`;
//         const changedFilterCopy = {...changedFilter};
//         changedFilterCopy.selected = false;

//         if (this.filterSidebar && this.filterSidebar[sidebarObservableName] && isObservable(this.filterSidebar[sidebarObservableName])) {
//             this.filterSidebar[sidebarObservableName]
//                 .pipe(
//                     first(), // take only the first subscription, this operator will automatically unsubscribe the observable
//                 )
//                 // filterTypeCurrentOptions === options returned by the filter type constructed above's observable inside the filterSidebar
//                 .subscribe((filterTypeCurrentOptions: IServerDropdownOption[]) => {
//                     console.log('current options ', filterTypeCurrentOptions);
//                     this.filterSidebar.updateOptionSelection({
//                         filter: filterType,
//                         observableName: sidebarObservableName,
//                         optionsList: [...filterTypeCurrentOptions],
//                         changed: changedFilterCopy,
//                     });
//                 });
//         }
//     }
// }
