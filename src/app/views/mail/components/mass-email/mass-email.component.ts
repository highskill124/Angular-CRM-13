import {Component, OnInit, ViewChild} from '@angular/core';
import {EmailCampaignService} from '../../../../services/email-campaign.service';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {ToasterService} from 'angular2-toaster';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {ICampaignList} from '../../../../models/email-campaigns';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {IFarm} from '../../../../models/farm';
import {SocketService} from '../../../../services/socket.service';
import { TagService } from '../../../../services/tag.service'
import { BucketService } from '../../../../services/bucket.service'
import { shareReplay } from 'rxjs/operators';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { StateService } from '../../../../services/header.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
    selector: 'app-mass-email',
    templateUrl: './mass-email.component.html',
    styleUrls: ['./mass-email.component.scss']
})


export class MassEmailComponent implements OnInit {

    @ViewChild('select') select: MatSelect;

    
    guids = DropdownGuids;
    campaignList: ICampaignList[];
    massEmailTypeList: IServerDropdownOption[];
    tractList: IFarm[];
    mailSignatureList: IServerDropdownOption[];
    tagOptions$: Observable<Array<IServerDropdownOption>>;
    bucketOptions$: Observable<Array<IServerDropdownOption>>;
    massEmailForm: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    progress = 0;
    recordCount = 0;
    matvalue = 0;
    mailmessage = '';
    processingMassMail = false;
    mailProcessId = '';
    massEmailTypeValue = ''
    allSelected = false;

    sampletext : string

    constructor(
        private fb: FormBuilder,
        private emailcampaignservice: EmailCampaignService,
        private cbLookupService: CouchbaseLookupService,
        private socketService: SocketService,
        private toasterService: ToasterService,
        private tagService: TagService,
        private bucketService: BucketService,
        private state: StateService

    ) {
       //this.socketInit();
        this.state.setTitle('Mass Email');
    }


    ngOnInit() {
        this.massEmailForm = this.createForm();
        this.getemailCampaignList()
        this.getTractList()
        this.getmassEmailTypeList(this.guids.MASS_MAIL_TYPE)
        this.tagOptions$ = this.tagService.tagList('Contact').pipe(shareReplay());
        this.bucketOptions$ = this.bucketService.bucketList('Contact').pipe(shareReplay());

    }

    getemailCampaignList() {
        this.emailcampaignservice.getCampaignList().subscribe((response: any) => {
            this.campaignList = response
        })
    }

    getTractList() {
        this.emailcampaignservice.getTractList().subscribe((response: any) => {
            this.tractList = response
        })
    }

    getmassEmailTypeList(guid: string) {
        this.cbLookupService.getOptions(guid).subscribe((response: any) => {
            this.massEmailTypeList = response
        })
    }

    toggleAllSelection() {
        if (this.allSelected) {
          this.select.options.forEach((item: MatOption) => item.select());
        } else {
          this.select.options.forEach((item: MatOption) => item.deselect());
        }
      }
       optionClick() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
          if (!item.selected) {
            newStatus = false;
          }
        });
        this.allSelected = newStatus;
      }



    createForm(): FormGroup {
        return this.fb.group(
            {
                emailCampaign: [{value: '', disabled: false}, Validators.required],
                massEmailType: [{value: '', disabled: false}, Validators.required],
                tractList: ['', RxwebValidators.required({conditionalExpression: 'x => x.massEmailType === "Farm"' })],
                massEmailSender: [{value: '', disabled: false}, Validators.required],
                trackMessage: [{value: true, disabled: false}],
                trackLinks: [{value: false, disabled: false}],
                trackResponse: [{value: false, disabled: false}],
                notifySender: [{value: false, disabled: false}],
                deliveryReceipt: [{value: false, disabled: false}],
                mailSignature: [{value: false, disabled: false}],
                mailSignatureSelection: [{value: '', disabled: false}],
                mailUnsubscribe: [{value: false, disabled: false}],
                mailUnsubscribeSelection: [{value: '', disabled: false}],
                tagfilter: [{value: '', disabled: false}],
                bucketfilter: [{value: '', disabled: false}],

            })
    }

    processMailing() {
        this.socketInit() 
        this.processingMassMail = true;
        console.log(this.massEmailForm.value)


        this.emailcampaignservice.sendMassEmail(this.massEmailForm.value, this.socketService.socketId).subscribe((response: any) => {
            console.log(response),
                this.mailmessage = '',
                this.processingMassMail = false
        })
    }

    stopMailing() {
        // TODO: Add Check if Success also disable after initial click
        // this.emailcampaignservice.stopMassEmail(this.mailProcessId).subscribe((response: any) => {
        // console.log(response),
        this.socketService.emit('stopMailProcess', this.mailProcessId);
        this.toasterService.pop('error', 'Alert!', 'Mailing has been stoped')
    }

    // )

    // }

    socketInit() {
        this.socketService.ioInject('emailCount', (count) => {
            console.log(`Total Email record count ${count.count}`);
            this.recordCount = count.count
            this.progress = 0
            console.log(this.socketService.socketId)

        });

        this.socketService.ioInject('emailProcessed', (count) => {
            console.log(`We got an Update ${count.count}`)
            this.progress = count.count
            this.matvalue = this.progress / this.recordCount * 100

        });

        this.socketService.ioInject('massEmailSend', (sendTo) => {
            this.mailmessage = `We send message to ${sendTo.name} and the folowing email ${sendTo.address}`
        })

        this.socketService.ioInject('emailProcess', (data) => {
            console.log(`Mail Process ID : ${data.id}`)
            this.mailProcessId = data.id;
            console.log(this.mailProcessId)
        })

    }
}
