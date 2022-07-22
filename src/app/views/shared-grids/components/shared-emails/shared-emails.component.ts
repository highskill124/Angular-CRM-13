import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridColumnsListGuids } from '../../../../models/grid-columns-list-guids';
import { Router } from '@angular/router';
import { MatDialogComponent } from '../../../../modules/mat-dialog/mat-dialog.component';
import { FilterGridComponent } from '../../../filter-grid/components/filter-grid/filter-grid.component';
import { ToasterService } from 'angular2-toaster';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../../models/user';
import { EmailService } from '../../../../services/email.service';
import { sidebarColumnsCollapsed } from '../../../../modules/custom-ag-grid/sidebar-configurations/sidebar-columns-collapsed';
import {EmailViewComponent} from './../../../emails/components/email-view/email-view.component';
import { IMail } from '../../../../models/mail';
import { MailService } from '../../../../services/mail.service';
@Component({
    selector: 'app-shared-emails',
    templateUrl: './shared-emails.component.html',
    styleUrls: ['./shared-emails.component.scss']
})
export class SharedEmailsComponent implements OnInit, OnDestroy {
    private _contactId = '';

    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    @ViewChild('filterGrid') filterGrid: FilterGridComponent;
    @Input() gridtitle: String
    @Input() hideSelectOption = true;
    @Input() hideHiddenDisplay = true;
    @Input() showloading = false;
    @Input() hardReload = false;
    @ViewChild('notifyTemp') notifyTemp: TemplateRef<any>;




    public config = {
        grid: GridColumnsListGuids.SHARED_EMAIL_GRID,
        column: GridColumnsListGuids.SHARED_EMAIL_GRID,
        filter: null,
        sideBarConfig: false,


        // remove the search options
        quickSearchTypeOption: null,

        // configure export
        exportFormats: null,

        // configure actions
        actions: [

            {
                icon: 'email',
                color: 'green',
                class: 'custom-size',
                // isActive: false,
                callback: (data, params) => this.handleView(data, params)
            },

            {
                icon: 'radar',
                color: 'otange',
                class: 'custom-size',

                callback: (data, params) => this.handleTracking(data, params)
            },
        ],
        // configure plus actions
        plusActions: [

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


    constructor(private emailService: EmailService,
                private router: Router,
                private dialog: MatDialog,
                private mailService: MailService,
                private toasterService: ToasterService,
                private authService: AuthService) {
    }
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
        console.log('Parent ID : ' + this._parent_id)
    }

    handleView(mode, data ) {
        const DocID: string = data.data.DocId
        const dialogRef = this.dialog.open(EmailViewComponent,
            {
                data: {DocId: DocID, mode: 'view'},
                disableClose: true, width: '850px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
                autoFocus: false
            });

        dialogRef.afterClosed().subscribe(() => {
        });
    }

    handleTracking(data, params) {
       console.log('Will display tracking Info for ' + data.tracking_nbr);


    }


    reloadGrid() {
        return (param) => this.emailService.getAllAdapted(this._parent_id, param)
    }

    get dataFetcherMethod() {
        return (param) => this.emailService.getAllAdapted(this._parent_id, param);
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

    updateNotifyStatus(row: IMail) {
        // update notify status by reversing
        row.notify = !row.notify;
        this.mailService.updateNotifyStatusForTrackRequest({trackRequestId: row.DocId, newNotifyState: row.notify})
            .subscribe(
                (res) => {
                },
                (error) => {
                    // revert notify status on error
                    row.notify = !row.notify;
                }
            )
    }
}
