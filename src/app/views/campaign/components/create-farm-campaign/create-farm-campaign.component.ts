import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster';
import {FarmCampaignForm} from '../farm-campaign.model';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {Observable} from 'rxjs';
import {ServerDropdownOption} from '../../../../models/server-dropdown';
import {map, retry, takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';

@Component({
    selector: 'app-create-farm-campaign',
    templateUrl: './create-farm-campaign.component.html',
    styleUrls: ['./create-farm-campaign.component.css']
})
export class CreateFarmCampaignComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    @Input() formData: FarmCampaignForm = new FarmCampaignForm({});
    @Input() submitText = 'Save';
    @Input() heading = 'New Farm Campaign';
    @Input() submitEndpoint = '/campaign/new';
    @Input() requestMethod = 'post';
    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    guids = DropdownGuids;
    farmIdOptions$: Observable<Array<ServerDropdownOption>>;

    alive = true;

    get status() {
        return this.form.get('status');
    }

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private toasterService: ToasterService,
        // private location: Location,
    ) {
        super();
    }

    ngOnInit() {
        // TODO: Check if we return a Success from the Query or Not as all Request will have now a Success of true or false

        this.farmIdOptions$ = this.http.get(`${environment.socketUrl}/farms/FarmName`)
            .pipe(
                map((options: any) => {
                    return options.Data.map((option) => {
                        // console.log(option.guid + " - " + option.NAME)
                        return new ServerDropdownOption({
                            value: option.guid,
                            name: option.NAME,
                            selected: option.selected && option.selected === 1,
                        });
                    });
                    // this.cacheResult(guid, res);
                    // return res;
                }),
                retry(2),
            );

        this.initForm();
        this.trackValuesChanged();
    }

    initForm() {
        this.form = this.fb.group({
            status: [this.formData.status],
            event_name: [this.formData.event_name, [Validators.required]],
            event_description: [this.formData.event_description],
            event_date: [this.formData.event_date, [Validators.required]],
            farm_id: [this.formData.farm_id, [Validators.required]],
            start_date: [this.formData.start_time],
            start_time: [this.formData.start_time],
            end_date: [this.formData.end_time],
            end_time: [this.formData.end_time],
            distribution_method: [this.formData.distribution_method, [Validators.required]],
            distribution_cost: [this.formData.distribution_cost],
            doc1_url: [this.formData.doc1_url],
            doc2_url: [this.formData.doc2_url],
            created_on: [{value: this.formData.created_on, disabled: true}],
            created_by: [{value: this.formData.created_by, disabled: true}],
            updated_on: [{value: this.formData.updated_on, disabled: true}],
            updated_by: [{value: this.formData.updated_by, disabled: true}],
        });
    }

    trackValuesChanged() {
        if (this.requestMethod === 'put') {
            this.submitted = true;
            // const initialState = this.form.value;
            this.form.valueChanges.pipe(
                takeWhile(_ => this.alive)
            ).subscribe(formData => {
                // console.log('changed ', formData);
                this.submitted = false;
            });
        }
    }

    create(formData) {
        const startTime = new Date(formData.start_date);
        startTime.setHours(new Date(formData.start_time).getHours());
        startTime.setMinutes(new Date(formData.start_time).getMinutes());
        formData.start_time = startTime;

        const endDate = new Date(formData.end_date);
        endDate.setHours(new Date(formData.end_time).getHours());
        endDate.setMinutes(new Date(formData.end_time).getMinutes());
        formData.end_time = endDate;

        this.errors = this.messages = [];
        this.submitted = true;

        this.http.request(
            this.requestMethod,
            `${environment.socketUrl}${this.submitEndpoint}`,
            {body: formData},
        ).subscribe((res: any) => {
                console.log(res);
                if (res.Success === true) {
                    this.toasterService.pop('success', 'Success!', res.Message);

                    // switch to updating
                    this.submitText = 'Update';
                    if (this.requestMethod !== 'put') {
                        // UpdatedCampaignID
                        this.heading = 'Update Campaign - ' + res.CampaignID;
                    }
                    if (res.CampaignID) {
                        this.formData.CampaignID = res.CampaignID;
                    }
                    this.submitEndpoint = `/campaign/update/${this.formData.CampaignID}`;
                    this.requestMethod = 'put';
                    this.trackValuesChanged();
                } else {
                    this.submitted = false;
                    this.showMessages.error = true;
                    this.toasterService.pop('error', res.Message);
                    this.errors = [res.Message];
                }
            },
            (error) => {
                this.submitted = false;
                this.toasterService.pop('error', 'Something went wrong!', 'Please try again.');
                console.error('Failed to register campaign ', error);
            },
        );
    }

    ngOnDestroy() {
        this.alive = false;
    }

}
