import {Component, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {Router} from '@angular/router';
import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {ToasterService} from 'angular2-toaster';
import {EmailCampaignService} from '../../../../services/email-campaign.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-campaign-list',
    templateUrl: './campaign-list.component.html',
    styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent {

    /** Create a reference to the filter grid instance. This will be used to access the object's methods. */
    @ViewChild('filterGrid') filterGrid: FilterGridComponent;

    public config = {
        grid: GridColumnsListGuids.EMAIL_CAMPAIGN_GRID,
        column: GridColumnsListGuids.EMAIL_CAMPAIGN_GRID,
        filter: GridColumnsListGuids.EMAIL_CAMPAIGN_GRID,


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
            // tslint:disable-next-line: max-line-length
            {selected: ['any'], action: 'modal', label: 'New Email Campaign', click: (data, params) => this.newTemplate(data, params)},
            // { selected: ['one'], action: 'modal', label: 'Edit Bucket', click: (data, params) => this.handleDelete('page', data, params) },
        ],

    };

    constructor(private emailCampaignService: EmailCampaignService, private router: Router, private dialog: MatDialog,
                private toasterService: ToasterService) {

    }

    newTemplate(data, params) {
        console.log(data)

        this.router.navigateByUrl(`/Emails/EmailCampaign/new`)

    }

    handleEdit(mode, data, params) {
        console.log(data)
        let DocID: string
        if (mode === 'grid') {
            console.log('grid Mode')
            console.log('Doc Key: ' + data.DocId)
            DocID = data.DocId;
        } else {
            DocID = data.DocId;
            console.log('Doc Key: ' + data.DocId)
        }
        this.router.navigate(['/Emails/EmailCampaign', DocID]);
    }


    handleDelete(data, params) {
        const dialogRef = this.dialog.open(MatDialogComponent,
            {
                data: {message: 'Are you sure you want to delete this record ?', title: 'Delete can`t be undone', rightbttntext: 'No'},
                disableClose: true, width: '400px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
                autoFocus: false
            })
        console.log('Will Delete Template ' + data.DocId)

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                console.log('Will DELETE THIS RECORD');
                this.deleteTemplete(data.DocId)


            } else {
                console.log('Will not DELETE THIS RECORD');
            }
        });

    }


    reloadGrid() {
        // return (param) => this.mailTemplateService.getAllTemplates(param);
    }

    get dataFetcherMethod() {
        return (param) => this.emailCampaignService.getCampaignListGrid();
    }

    // get dataExportMethod() {
    //     return (param) => this.mailTemplateService.getAllTemplates(param);
    // }


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

    deleteTemplete(id: string) {
        this.emailCampaignService.deleteEmailCampaign(id).subscribe((res: any) => {
                if (res.Success === true) {
                    console.log(res)
                    this.toasterService.pop('success', 'Success!', res.Message);
                    this.reloadData()
                }
    })}


}
