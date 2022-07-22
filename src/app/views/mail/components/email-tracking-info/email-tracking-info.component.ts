import {Component, OnInit, Inject} from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-email-tracking-info',
    templateUrl: './email-tracking-info.component.html',
    styleUrls: ['./email-tracking-info.component.scss']
})


export class EmailTrackingInfoComponent implements OnInit {
    requestData: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<EmailTrackingInfoComponent>,
    private dialog: MatDialog, private toasterService: ToasterService, private fb: FormBuilder,
    private emailcampaignservice: EmailCampaignService) {


}


ngOnInit() {
    this.emailcampaignservice.getemailTrackingRequest(this.data.track_request).subscribe(
        res => (this.requestData = res.Data)
    )

}

}
