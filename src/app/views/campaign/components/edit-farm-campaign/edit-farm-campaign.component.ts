import {AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FarmCampaignForm} from '../farm-campaign.model';
import {Location} from '@angular/common';
import {CreateFarmCampaignComponent} from '../create-farm-campaign/create-farm-campaign.component';
import {takeWhile} from 'rxjs/operators';
import {ComponentCanDeactivate} from '../../../../guards/can-deactivate/component-can-deactivate';
import {FormGroup} from '@angular/forms';
import {FarmCampaignService} from '../../../../services/farm-campaign/farm-campaign.service';
import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'app-edit-farm-campaign',
    templateUrl: './edit-farm-campaign.component.html',
    styleUrls: ['./edit-farm-campaign.component.css']
})
export class EditFarmCampaignComponent extends ComponentCanDeactivate implements OnInit, OnDestroy, AfterViewInit {

    formData: FarmCampaignForm;
    editForm: FormGroup;
    requestMethod = 'put';
    submitText = 'Update';
    heading: string;
    submitEndpoint: string;

    alive = true;

    @ViewChildren(CreateFarmCampaignComponent) createFarmCampaigns: QueryList<CreateFarmCampaignComponent>;

    constructor(
        private http: HttpClient,
        protected activatedRoute: ActivatedRoute,
        private farmCampaignService: FarmCampaignService,
        private location: Location,
        private toasterService: ToasterService,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {
        this.activatedRoute.params
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((params: Params) => {
                const CampaignID = (params['CampaignID']) ? params['CampaignID'] : '';
                // console.log('campaign ', CampaignID);
                this.http.get(`${environment.socketUrl}/campaign/detail/${CampaignID}`).subscribe((res: any) => {
                    this.formData = new FarmCampaignForm(res.Data[0]);
                    // console.log('campaign res ', res);
                    this.submitEndpoint = `/campaign/update/${this.formData.CampaignID}`;
                    this.heading = 'Update Farm Campaign - ' + CampaignID;
                });
            });
    }

    ngAfterViewInit() {
        this.createFarmCampaigns.changes
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((forms: QueryList<CreateFarmCampaignComponent>) => {
                this.editForm = forms.first.form;
            });
    }

    goBack() {
        this.location.back();
    }

    deleteCampaign(campaignID) {
        this.farmCampaignService.delete(campaignID)
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((res: any) => {
                if (res.Success === true) {
                    this.toasterService.pop('success', 'Success!', res.Message);
                    this.router.navigateByUrl('/FarmLink1/CampaignLink1/CampaignLink3');
                }
            });
    }

    ngOnDestroy() {
        this.alive = false;
    }

    canDeactivate(): boolean {
        if (this.editForm) {
            return !this.editForm.dirty;
        }
        return true;
    }

}
