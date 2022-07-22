import { FroalaUploadService } from './froala-upload.service';
import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map, tap} from 'rxjs/operators';
import {IGridDataFetcherParams} from '../modules/custom-ag-grid/ag-grid-base';
import {IApiResponseBody} from '../models/api-response-body';
import {DropdownGuids} from '../models/dropdown-guids.enum';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../models/server-dropdown';
import {IMail} from '../models/mail';
import {IEmail} from '../models/email';
import {CouchbaseLookupService} from './couchbase-lookup.service';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    guids = DropdownGuids;

    static adapt(message): IMail {
        return {
            DocId: message.DocId || message.id,
            click_count: message.click_count,
            to: message.send_to,
            from: message.send_from,
            subject: message.subject,
            cc: message.send_cc,
            bcc: message.send_bcc,
            track_click: message.track_click,
            track_message: message.track_message,
            track_reply: message.track_reply,
            tracking_nbr: message.tracking_nbr,
            notify: message.notify,
            message_body: message.message_body,
            msg_count: message.msg_count,
            send_datetime: message.send_datetime




        };
    }

    constructor(private api: ApiService, private cbLookupService: CouchbaseLookupService) {
    }

    create(email: Partial<IEmail>) {
        console.log(email)
        return this.api.post({endpoint: `/email/${email.parentId}`, body: email, useAuthUrl: true})
            .pipe(
                map(res => res as IApiResponseBody),
                map((res: IApiResponseBody) => {
                    res.Data = EmailService.adapt(res.Data);
                    console.log(res)
                    return res;
                })
            );
    }

    getAll(parentId: string, params?: IGridDataFetcherParams) {
        console.log('Get all messages' + parentId )
        return this.api.get({
            endpoint: `/email/emails/${parentId}`,
            params: {
                rowCount: params.perPage,
                offset: params.offset,
                ...(params.qsearch ? {qsearch: params.qsearch} : {}),
                ...(params.type && {type: params.type}),
            },
            useAuthUrl: false,
        }).pipe(
            map(res => res as IApiResponseBody),
        );
 
    }

    getAllEmailsForParent(parentId: string) {
        return this.api.get({ endpoint: `/email/parent/${parentId}`,useAuthUrl : false}).pipe(
            map(res => res as IApiResponseBody),
            tap(res =>console.log(res.Data)),
            map((res: IApiResponseBody) => res.Data, parentId),
        );
    }

    getAllAdapted(contactId: string, params?: IGridDataFetcherParams) {
        return this.getAll(contactId, params).pipe(
            map((res: IApiResponseBody) => {
                console.log(res);
                res.Data = res.Data && res.Data.map(message => {
                    return EmailService.adapt(message);
                });
                console.log(res);
                return res;
            }),
        );
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/email/${DocId}`, useAuthUrl: true}).pipe(
            map(res => res as IApiResponseBody),
            map((res: IApiResponseBody) => EmailService.adapt(res.Data[0])),
        );
    }

    /*update(param: { DocId: string; formData: IEmail }) {
        return this.api.patch({endpoint: `/email/${param.DocId}`, body: param.formData, useAuthUrl: true});
    }*/
    update(param: { emailId: string; formData: IEmail }) {
        const formData = {...param.formData, id: param.emailId};
        console.log(formData)
        return this.api.patch({
            endpoint: `/email/${param.formData.parentId}`,
            body: formData,
            useAuthUrl: true
        });
    }

    delete(id: string, parentId: string) {
        return this.api.delete({endpoint: `/email/${parentId}/${id}`, useAuthUrl: true});
    }

    emailTypeOptions(guid: string = this.guids.EMAIL_LABELS): Observable<IServerDropdownOption[]> {
        return this.cbLookupService.getOptions(guid);
    }

    getMessageDetail(trackid: string) {
        return this.api.get({endpoint: `/email/${trackid}`, useAuthUrl: false})
        .pipe(
            map(res => res as IApiResponseBody),
            map((res: IApiResponseBody) => {
                // res.Data = EmailService.adapt(res.Data);
                console.log(res)
                return res;
            })
        );

    }
}
