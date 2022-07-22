import {Component, OnInit} from '@angular/core';
import {LeadForm} from '../../lead';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'app-edit-lead',
    templateUrl: './edit-lead.component.html',
    styleUrls: ['./edit-lead.component.css']
})
export class EditLeadComponent implements OnInit {

    formData: LeadForm;
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
            const guid = (params['guid']) ? params['guid'] : '';
            console.log('lead id ', guid);
            this.http.get(`${environment.socketUrl}/leads/detail/${guid}`).subscribe((res: any) => {
                this.formData = new LeadForm(res.Data);
                console.log('lead res ', res);
                this.submitEndpoint = `/leads/update/${this.formData.LeadID}`;
                this.heading = 'Update Lead';
            });
        });
    }

}
