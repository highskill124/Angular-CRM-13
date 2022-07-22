import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {IFarmCampaign} from '../models/farm-campaign';
import {ApiService} from './api/api.service';
import { IApiResponseBody } from '../models/api-response-body';
import { IEmailCampaign, ICampaignList, IEmailTemplate } from '../models/email-campaigns'
import { IFarm } from '../models/farm';

@Injectable({providedIn: 'root'})
export class EmailCampaignService {

constructor(public api: ApiService) {}


  query(params?: any) {
    return this.api.get({endpoint: '/farming', params: params});
  }

  getCampaignListGrid() {
    return this.api.get({
        endpoint: '/campaign/emailCampaignsListGrid',
        params: {},
        useAuthUrl: false,
    }).pipe(
        tap(res => console.log(res)),
        map(res => res as IApiResponseBody),
        // map (res => res.Data as ICampaignList[])
    );
  }


  // Get Email Tracking Request Detail
  getemailTrackingRequest(id: string) {
    return this.api.get({
        endpoint: `/campaign/emailTrackingRequest/${id}`,
        params: {},
        useAuthUrl: false,
    }).pipe(

        map(res => res as IApiResponseBody),
        tap(res => console.log(res)),
    );
  }
// Update Email Campaign
  updateEmailCampaign( formData: any) {
      return this.api.patch({
          endpoint: '/campaign/emailCampaign',
          useAuthUrl: false,
          body : formData
      }).pipe (
        map(res => res as IApiResponseBody),
        tap(res => console.log(res)),
      )
  }

  // Delete Email Campaign
  deleteEmailCampaign( id: string) {
    return this.api.delete({
        endpoint: '/campaign/emailCampaign/' + id,
        useAuthUrl: false
    }).pipe (
      map(res => res as IApiResponseBody),
      tap(res => console.log(res)),
    )
}
  // Create Email Campaign
  createEmailCampaign( formData: any) {
      return this.api.post({
          endpoint: '/campaign/emailCampaign',
          useAuthUrl: false,
          body : formData
      }).pipe (
        map(res => res as IApiResponseBody),
        tap(res => console.log(res)),
      )
  }

  // Send Mass Email for Campaign
    sendMassEmail(formData: any, socketid: string) {
        return this.api.post({
            endpoint: '/campaign/sendMassEmail/' + socketid,
            body: formData,
            useAuthUrl: false
        }).pipe(

            map(res => res as IApiResponseBody),
            tap(res => console.log(res)),
        );


    }

  // Get List of All Email Templates
    getTemplateList() {
        return this.api.get({
            endpoint: '/campaign/emailTemplates',
            params: {},
            useAuthUrl: false,
        }).pipe(

            map(res => res as IApiResponseBody),
            map (res => res.Data as IEmailTemplate[]),
            tap(res => console.log(res)),
        );
    }

  getCampaignList() {
    return this.api.get({
        endpoint: '/campaign/emailCampaignsList',
        params: {},
        useAuthUrl: false,
    }).pipe(
        tap(res => console.log(res)),
        map(res => res as IApiResponseBody),
        map (res => res.Data as ICampaignList[])
    );
  }
  getCampaignDetail(id: string) {
    return this.api.get({
        endpoint: `/campaign/emailCampaign/${id}`,
        params: {},
        useAuthUrl: false,
    }).pipe(

        map(res => res as IApiResponseBody),
        map (res => res.Data[0] as IEmailCampaign ),
        tap(res => console.log(res)),
    );
  }

  stopMassEmail(id: string) {
    return this.api.get({
        endpoint: `/campaign/stopMassEmail/${id}`,
        params: {},
        useAuthUrl: false,
    }).pipe(

        map(res => res as IApiResponseBody)
    );
  }

  getTractList() {
    return this.api.get({
        endpoint: '/campaign/TractList',
        params: {},
        useAuthUrl: false,
    }).pipe(

        map(res => res as IApiResponseBody),
        map (res => res.Data as IFarm[] ),
        tap(res => console.log(res)),
    );
  }
  getAll(farmGuid: string): Observable<IFarmCampaign[]> {
    return this.api.get({endpoint: `/farming/FarmCampaigns/${farmGuid}`}).pipe(
      map((res: any) => this.adaptCampaigns(res.Data)),
    );
  }

  delete(guid: string) {
      return this.api.post({endpoint: `/campaign/delete/${guid}`, body: {}});
  }

  createCampaign() {


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

