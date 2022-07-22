export interface ITrackedMessage {
    DocId: string;
    clickCount: number;
    lastEventDateTime: string;
    msgCount: number;
    notify: true
    sendDateTime: string;
    sendBcc: string[];
    sendCc: string[]
    sendFrom: string;
    sendTo: string[];
    subject: string
    trackingNbr: string;
}

