export class FarmCampaignForm {
    CampaignID: string;
    status: string;
    event_name: string;
    event_description: string;
    event_date: any;
    farm_id: string;
    start_time: any;
    end_time: any;
    distribution_method: any;
    distribution_cost: string;
    doc1_url: string;
    doc2_url: string;
    created_on: any;
    created_by: any;
    updated_on: any;
    updated_by: any;

    constructor(formData: any) {
        this.CampaignID = formData.CampaignID;
        this.status = formData.status || '';
        this.event_name = formData.event_name || '';
        this.event_description = formData.event_description || '';
        this.event_date = formData.event_date ? new Date(formData.event_date) : '';
        this.farm_id = formData.farm_id || '';
        this.farm_id = formData.farm_id || '';
        this.start_time = formData.start_time ? new Date(formData.start_time) : '';
        this.end_time = formData.end_time ? new Date(formData.end_time) : '';
        this.distribution_method = formData.distribution_method || '';
        this.distribution_cost = formData.distribution_cost || 0;
        this.doc1_url = formData.doc1_url || '';
        this.doc2_url = formData.doc2_url || '';
        this.created_on = formData.created_on ? new Date(formData.created_on) : '';
        this.created_by = formData.created_by || '';
        this.updated_on = formData.updated_on ? new Date(formData.updated_on) : '';
        this.updated_by = formData.updated_by || '';
    }
}
