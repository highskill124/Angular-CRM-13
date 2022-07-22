import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster';
import {EmailCampaignService} from '../../../../services/email-campaign.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {takeWhile, tap} from 'rxjs/operators';
import {IEmailCampaign, IEmailHistory, ICampaignList, IEmailTemplate, IMailHistory, ICampaignUpdate} from '../../../../models/email-campaigns'
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {EmailTrackingInfoComponent} from '../email-tracking-info/email-tracking-info.component'
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import { Observable } from 'rxjs';
import { LoadingService } from '../../../../shared/components/loading/loading.service';
import {Location} from '@angular/common';




@Component({
    selector: 'app-emil-campaign',
    templateUrl: './email-campaign.component.html',
    styleUrls: ['./email-campaign.component.scss']
})
export class EmailCampaignComponent implements OnInit {
    emailCampaignForm: FormGroup;
    mode = 'New'
    guids = DropdownGuids;
    statusList: IServerDropdownOption[] = [];
    emailTemplateList$: Observable<IEmailTemplate[]>;
    heading: string;
    alive = true;
    DocId = ''
    formData: IEmailCampaign;
    emailData: IEmailHistory[]
    dataSource;
    showbounce = true;
    shownotopened = true;
    showopened = true;
    emailCampaign$: Observable<IEmailCampaign>;
    disableTemplate = false;
    saveBttnText = 'Create'
    editData: ICampaignUpdate



    displayedColumns: string[] = [ 'email', 'tracking_nbr', 'bounce', 'opened', 'actiondate', 'actionsColumn'];


    constructor(
        private emailcampaignservice: EmailCampaignService,
        protected activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private cbLookupService: CouchbaseLookupService,
        private router: Router,
        private dialog: MatDialog,
        private toasterService: ToasterService,
        private location: Location,
        private fb: FormBuilder) {
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
       this.dataSource.filter = filterValue.trim().toLowerCase();
      }

    ngOnInit() {



        this.getStatusList(this.guids.EMAIL_CAMPAIGN_STATUS)
        this.getemailTemplateList()
        this.activatedRoute.params.pipe(
            takeWhile(_ => this.alive),
        ).subscribe((params: Params) => {
            console.log(params['DocId'])
            if (params['DocId'] && params['DocId'] === 'new') {
                this.heading = 'New Template - ';
                this.emailCampaignForm = this.createForm();
            } else {
                console.log(params)
                this.mode = 'Edit'
                this.saveBttnText = 'Update'
                this.heading = '';
                this.DocId = params['DocId'];
                this.fetchData()
                this.emailCampaignForm = this.createForm();

            }

        })
    }

    getemailTemplateList() {
        this.emailcampaignservice.getTemplateList().subscribe((response: any) => {
            // tslint:disable-next-line:no-string-literal
            console.log(response);
            this.emailTemplateList$ = response
        })
    }


    createForm(): FormGroup {
        return this.fb.group(
            {
                subject: ['', Validators.required],
                status: ['', Validators.required],
                template_id: ['', Validators.required],
                summary: ['', Validators.required],
                start_date: ['', Validators.required],
                end_date: [''],
                created_on: [''],
                created_by: [''],
                updated_on: [''],
                updated_by: [''],
                first_email_sent: [''],
                last_email_send: [''],
                nbr_of_attachments_opened: [''],
                nbr_of_bounces: [''],
                nbr_of_email_opened: [''],
                nbr_of_emails: [''],
                nbr_of_unique_attachments_opened: [''],
                nbr_of_unique_email_opened: [''],
                showbounce: [''],
                showopened: [''],
                shownotopened : ['']
            })
    }

    getStatusList(guid: string) {
        this.cbLookupService.getOptions(guid).subscribe((response: any) => {
            console.log(response);
            this.statusList = response
        })
    }

    fetchData() {
        this.emailCampaign$ = this.emailcampaignservice.getCampaignDetail(this.DocId)
        const loadCampaign$ = this.loadingService.showLoaderUntilCompleted(this.emailCampaign$).subscribe(
            (resp) => {
            (this.formData = resp),
            this.populateForm()
        })}

    populateForm() {
        this.emailCampaignForm.controls['subject'].setValue(this.formData.subject),
        this.emailCampaignForm.controls['summary'].setValue(this.formData.summary),
        this.emailCampaignForm.controls['template_id'].setValue(this.formData.template_id),
        this.emailCampaignForm.controls['status'].setValue(this.formData.status),
        this.emailCampaignForm.controls['start_date'].setValue(new Date(this.formData.start_date))
        if (this.valueTest(this.formData.end_date)) {
            this.emailCampaignForm.controls['end_date'].setValue(new Date(this.formData.end_date))
        }
        this.emailCampaignForm.controls['created_on'].setValue(new Date(this.formData.history.created_on))
        this.emailCampaignForm.controls['created_by'].setValue(this.formData.history.created_by_name)
        this.emailCampaignForm.controls['updated_on'].setValue(new Date(this.formData.history.updated_on))
        this.emailCampaignForm.controls['updated_by'].setValue(this.formData.history.updated_by_name)
        this.emailCampaignForm.controls['first_email_sent'].setValue(new Date(this.formData.metrics.first_email_sent))
        this.emailCampaignForm.controls['last_email_send'].setValue(new Date(this.formData.metrics.last_email_send))
        this.emailCampaignForm.controls['nbr_of_attachments_opened'].setValue(this.formData.metrics.nbr_of_attachments_opened)
        this.emailCampaignForm.controls['nbr_of_bounces'].setValue(this.formData.metrics.nbr_of_bounces)
        this.emailCampaignForm.controls['nbr_of_email_opened'].setValue(this.formData.metrics.nbr_of_email_opened)
        this.emailCampaignForm.controls['nbr_of_emails'].setValue(this.formData.metrics.nbr_of_emails)
        this.emailCampaignForm.controls['nbr_of_unique_attachments_opened'].setValue(this.formData.metrics.nbr_of_unique_attachments_opened)
        this.emailCampaignForm.controls['nbr_of_unique_email_opened'].setValue(this.formData.metrics.nbr_of_unique_email_opened)

        this.emailData = this.formData.emails
        if (this.emailData.length > 0) {
            this.disableTemplate = true
        }
        this.showBounceOnly(this.formData.emails);
    }


    viewTrackingInfo(row) {
const dialogRef = this.dialog.open(EmailTrackingInfoComponent,
            {
                data: row,
                disableClose: false, width: '600px', position: {
                    top: '50px'
                },
            })
    }

    showBounceOnly(data) {
        if (this.showbounce !== true) {
            data = data.filter(item => item.bounce !== true)
        }
        if (this.showopened !== true) {
        data = data.filter(item => item.opened !== true)
        }
        this.dataSource = new MatTableDataSource(data);
    }

    filterchange(data) {
        if (data.id === 'bounce') {
            this.showbounce = data.data.checked
        }
        if (data.id === 'open') {
            this.showopened = data.data.checked
        }
        if (data.id === 'notopen') {
            this.shownotopened = data.data.checked
        }
        this.showBounceOnly(this.emailData)

        console.log(data)
        console.log(this.showbounce + ' - ' + this.shownotopened + ' - ' + this.showopened)
    }
    close() {
        // TODO: Implement Close Function to go back to Home page
    }

    printCampaign() {
        // TODO: Implemt Campain Print Function
    }
    reloadForm() {
        this.fetchData();
    }

    save() {
        this.editData = {
            DocId : this.DocId,
            template_id: this.emailCampaignForm.value.template_id,
            subject : this.emailCampaignForm.value.subject,
            status : this.emailCampaignForm.value.status,
            summary : this.emailCampaignForm.value.summary,
            start_date : this.emailCampaignForm.value.start_date,
            end_date : this.emailCampaignForm.value.end_date
        }
        if ( this.mode  === 'Edit') {

             const updateCampaign$ = this.emailcampaignservice.updateEmailCampaign(this.editData)
             const loadCampaign$ = this.loadingService.showLoaderUntilCompleted(updateCampaign$).subscribe(
                (resp) => {
                    if (resp.Success === true) {
                        this.toasterService.pop('success', 'Success!', resp.Message);

                    } else {
                        this.toasterService.pop('error', resp.Message);
                    }
                    })
        } else {
            console.log('Will Create')
            const createCampaign$ = this.emailcampaignservice.createEmailCampaign(this.editData)
            const loadCampaign$ = this.loadingService.showLoaderUntilCompleted(createCampaign$).subscribe(
               (resp) => {
                   if (resp.Success === true) {
                       if (resp.Data.docID) {
                        this.mode = 'Edit'
                        this.saveBttnText = 'Update'
                        this.heading = '';
                        this.DocId = resp.Data.docID;
                        this.toasterService.pop('success', 'Success!', resp.Message);
                       } else {
                        this.toasterService.pop('error', 'There was error creating Campaign');
                       }



                   } else {
                       this.toasterService.pop('error', resp.Message);
                   }

        })
    }
    }
    goBack() {
        this.location.back();
    }

    valueTest(scope) {
        if (scope == null || scope === undefined || scope === '' || scope.lenght === 0) {
            return false } else {
                return true
            }

    }
}
