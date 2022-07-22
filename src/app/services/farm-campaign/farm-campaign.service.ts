import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IFarmCampaign} from '../../models/farm-campaign';
import {ApiService} from '../api/api.service';

@Injectable({providedIn: 'root'})
export class FarmCampaignService {

    constructor(public api: ApiService) {
    }

    query(params?: any) {
        return this.api.get({endpoint: '/farming', params: params});
    }

    getAll(farmGuid: string): Observable<IFarmCampaign[]> {
        return this.api.get({endpoint: `/farming/FarmCampaigns/${farmGuid}`}).pipe(
            map((res: any) => this.adaptCampaigns(res.Data)),
        );
    }

    delete(guid: string) {
        return this.api.post({endpoint: `/campaign/delete/${guid}`, body: {}});
    }

    private adaptCampaigns(campaignsArray: any): IFarmCampaign[] {
        return campaignsArray.map(campaign => {
            return {
                CampaignID: campaign.CampaignID,
                created_on: campaign.created_on,
                distribution_cost: campaign.distribution_cost,
                distribution_method: campaign.distribution_method,
                event_date: campaign.event_date,
                event_description: campaign.event_description,
                event_name: campaign.event_name,
                farm_id: campaign.farm_id,
                farm_name: campaign.farm_name,
                status: campaign.status,
                user_name: campaign.user_name,
            };
        })
    }

}
