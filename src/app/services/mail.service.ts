import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map} from 'rxjs/operators';
import {ServerDropdownOption} from '../models/server-dropdown';
import {Observable} from 'rxjs';
import {IMail} from '../models/mail';
import {MailTemplateService} from './mail-template.service';

@Injectable({
    providedIn: 'root',
})
export class MailService {

    static adapt(fields): IMail {
        return {
            DocId: fields.DocId || fields.id,
            from: fields.from,
            to: fields.send_to,
            subject: fields.subject,
            notify: fields.notify,
            message_body: fields.message_body,
            cc: fields.cc,
            bcc: fields.bcc,
            track_message: fields.track_message,
            track_click: fields.track_click,
            track_reply: fields.track_reply,
            notify_user: fields.notify_user,
            click_count: fields.click_count,
            msg_count: fields.msg_count,
            send_datetime: fields.send_DateTime,
        }
    }

    constructor(public api: ApiService) {
    }

    getAll(params?: { rowCount?: string | number, offset?: string | number }): Observable<IMail[]> {
        return this.api.get({endpoint: `/mail/list?rowCount=${params.rowCount}&offset=${params.offset}`}).pipe(
            map((res: any) => res.Data.map(fields => {
                return MailService.adapt(fields);
            })),
        );
    }

    templates() {
        return this.api.get({endpoint: `/email/templates`}).pipe(
            map((res: any) => res.Data.map(template => {
                return new ServerDropdownOption({
                    name: template.title,
                    value: template.DocId,
                    selected: template.selected
                });
            })),
        );
    }

    emailFromAddresses() {
        return this.api.get({endpoint: `/emailfrom`, useAuthUrl: true}).pipe(
            map((res: any) => res.Data.map(fromAddress => {
                return new ServerDropdownOption({
                    name: fromAddress.address,
                    value: fromAddress.guid,
                    selected: fromAddress.default,
                });
            })),
        );
    }

    /**
     * Fetch details of a mail element
     * @param DocId
     */
    templateDetail(DocId) {
        return this.api.get({endpoint: `/email/templateDetail/${DocId}`}).pipe(
            map((res: any) => MailTemplateService.adapt(res.Data)),
        );
    }

    create(formData: IMail) {
        return this.api.post({endpoint: '/email', body: formData});
    }

    /*fetch(DocId) {
      return this.api.get({endpoint: `/mail/detail/${DocId}`}).pipe(
          map((res: any) => MailService.adapt(res.Data)),
      );
    }*/

    fetch(DocId) {
        return this.api.get({endpoint: `/email/${DocId}`, useAuthUrl: true}).pipe(
            map((res: any) => MailService.adapt(res.Data)),
        );
    }

    update(param: { DocId: string; formData: IMail }) {
        return this.api.post({endpoint: `/mail/update/${param.DocId}`, body: param.formData});
    }

    updateNotifyStatusForTrackRequest(params: { trackRequestId: string, newNotifyState: boolean }) {
        return this.api.patch({
            endpoint: `/notify/${params.trackRequestId}/${params.newNotifyState}`,
            body: {},
            useAuthUrl: true,
        });
    }
}
