import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {IBaseNote} from '../models/base-note';
import {map} from 'rxjs/operators';
import {IMessageTrackingDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';
import {IApiResponseBody} from '../models/api-response-body';
import {ITrackedMessage} from '../models/tracked-message';
import {MessageTrackingFilter} from '../enums/message-tracking-filter.enum';

@Injectable({
    providedIn: 'root'
})
export class MessageTrackingService {

    static adapt(note): ITrackedMessage {
        return {
            DocId: note.DocId,
            clickCount: note.click_count,
            lastEventDateTime: note.last_event_DateTime,
            msgCount: note.msg_count,
            notify: note.notify,
            sendDateTime: note.send_DateTime,
            sendBcc: note.send_bcc,
            sendCc: note.send_cc,
            sendFrom: note.send_from,
            sendTo: note.send_to,
            subject: note.subject,
            trackingNbr: note.tracking_nbr,
        };
    }

    constructor(private api: ApiService) {
    }

    create(formData: Partial<ITrackedMessage>) {
        return this.api.post({endpoint: `/notes/new`, body: formData, useAuthUrl: true})
            .pipe(
                map((res: any) => {
                    res.Data = MessageTrackingService.adapt(res.Data);
                    return res;
                })
            );
    }

    getAll(params: IMessageTrackingDataFetcherParams = {}, adaptResponse = true) {
        return this.api.get({
            endpoint: `/track/list`,
            params: {
                ...(params.perPage && {rowCount: params.perPage}),
                ...(params.offset && {offset: params.offset}),
                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params[MessageTrackingFilter.TRACTS] && {type: params[MessageTrackingFilter.TRACTS]}),
            },
        }).pipe(
            map(res => res as IApiResponseBody),
            map((res: IApiResponseBody) => {
                if (adaptResponse) {
                    res.Data = res.Data && res.Data.map(message => {
                        // construct DocId and return data as received
                        return MessageTrackingService.adapt(message);
                    });
                }
                // console.log(res.Data);
                return res;
            }),
        );
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/track/${DocId}`}).pipe(
            map((res: any) => MessageTrackingService.adapt(res.Data)),
        );
    }

    update(param: { DocId: string; formData: IBaseNote }) {
        return this.api.patch({endpoint: `/track/${param.DocId}`, body: param.formData});
    }
}
