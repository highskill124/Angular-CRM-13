export interface IEmailCampaign {
    DocId: string;
    _id: String;
    _type: string;
    start_date: string;
    end_date: string;
    template_id: string;
    status: string;
    subject: string;
    summary: string;
    emails: IEmailHistory[];
    history: ICampaignHistory;
    metrics: ICampaignMetrics;
    tags: [],
    librarys: []


}

export interface ICampaignList {
    id: string;
    status: String;
    summary: string;
}

export interface IEmailHistory {
    id: string;
    address: string;
    send_date: string;
    tracking_nbr: string;
    bounce: boolean;
}

export interface ICampaignMetrics {
    first_email_sent: string;
    last_email_send: string;
    nbr_of_attachments_opened: number;
    nbr_of_bounces: number;
    nbr_of_email_opened: number;
    nbr_of_emails: number;
    nbr_of_unique_attachments_opened: number;
    nbr_of_unique_email_opened: number;
}

export interface ICampaignHistory {
    created_by: string;
    created_by_name: string;
    created_on: string;
    updated_on: string;
    updated_by: string;
    updated_by_name: string;
}

export interface IEmailTemplate {
    id: string;
    subject: string;
    title: string;
    created_on: string;
}

export interface IMailHistory {
    bounce: boolean;
    name: string;
    email: string[];
    opened: boolean;
    actiondate: string;
    senddate: string;
  }

  export interface ICampaignUpdate {
    DocId: string;
    template_id: string;
    subject: string;
    status: string;
    summary: string;
    start_date: string;
    end_date: string
  }
