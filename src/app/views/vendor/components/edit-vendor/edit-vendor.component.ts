import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, Params} from '@angular/router';
import {Vendor} from '../vendor.model';

@Component({
    selector: 'app-edit-vendor',
    templateUrl: './edit-vendor.component.html',
    styleUrls: ['./edit-vendor.component.css']
})

export class EditVendorComponent implements OnInit {

    formData: Vendor;
    requestMethod = 'put';
    submitText = 'Update';
    heading: string;
    submitEndpoint: string;

    constructor(
        private http: HttpClient,
        protected activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            const VendorID = (params['VendorID']) ? params['VendorID'] : '';
            // console.log('campaign ', CampaignID);
            this.http.get(`${environment.socketUrl}/vendor/detail/${VendorID}`).subscribe((res: any) => {
                this.formData = new Vendor(res[0]);
                console.log('vendor res ', res);
                this.submitEndpoint = `/vendor/update/${this.formData.VendorId}`;
                this.heading = 'Update Vendor - ' + VendorID;
            });
        });
    }

}
