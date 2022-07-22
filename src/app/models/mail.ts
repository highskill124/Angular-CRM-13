export interface IMail {
    DocId: string;
    from: string;
    to: string[];
    subject: string;
    notify: boolean;
    message_body: string;
    cc: string;
    bcc: string;
    track_message: boolean;
    track_click: boolean;
    track_reply: boolean;
    notify_user?: boolean;
    click_count?: number;
    msg_count?: number;
    send_datetime?: string;
    tracking_nbr?: string;
}


export interface IMassage {
    DocId: string;
    from: string;
    to: string[];
    subject: string;
    notify: boolean;
    message_body: string;
    cc: string;
    bcc: string;
    track_message: boolean;
    track_click: boolean;
    track_reply: boolean;
    notify_user?: boolean;
    click_count?: number;
    msg_count?: number;
    send_datetime?: string;
}
