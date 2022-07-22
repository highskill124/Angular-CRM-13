export interface IEmail {
    id: string;
    parentId?: string;
    address: string;
    name?: string;
    type: string;
    otherLabel?: string;
    source?: string;
    dnmm?: string;
    dflt?: boolean;
    status?: string;
    bounce?: boolean;
    equityUpdate?: boolean;
    generalMarketing?: boolean;
    ocHousing?: boolean;
    history?: IEmailHistory 
}


export interface IEmailHistory{
    changeDate? :string;
    header? : string;
    ip? : string;
    source? : string;
}
