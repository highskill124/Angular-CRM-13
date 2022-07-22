export interface ITag {
    name: string;
}

export interface INote {
    id: number;
    type: string;
    subject: string;
    created_on: string;
    created_by: string;
    private: number;
    notes: string;
    format: string;
}

export class Vendor {
    VendorId: number;
    company_name: string;
    dba: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    licnbr: string;
    email: string;
    website: string;
    prefered: number;
    share: number;
    contacts: {
        p_name: string;
        p_title: string;
        p_phone: string;
        p_mobile: string;
        p_email: string;
        s_name: string;
        s_title: string;
        s_phone: string;
        s_mobile: string;
        s_email: string;
    };
    tags: Array<ITag>;
    notes: Array<INote>;

    constructor(formData: any) {
        this.VendorId = formData.id;
        this.company_name = formData.company_name || '';
        this.dba = formData.dba || '';
        this.address = formData.address || '';
        this.city = formData.city || '';
        this.state = formData.state || '';
        this.zip = formData.zip || '';
        this.licnbr = formData.licnbr || '';
        this.email = formData.email || '';
        this.website = formData.website || '';
        this.prefered = formData.prefered || 0;
        this.share = formData.share || '';
        this.contacts = formData.contacts || {};
        this.tags = formData.tags || [];
        this.notes = formData.notes || [];
    }
}
