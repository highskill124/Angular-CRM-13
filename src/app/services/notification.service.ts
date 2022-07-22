import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map} from 'rxjs/operators';
import {INotification} from '../models/notification';
import {IApiResponseBody} from '../models/api-response-body';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  static adapt(item): INotification {
        return {
          DocId: item.DocId,
          user_guid: item.user_guid,
          type: item.type,
          status: item.status,
          subject: item.subject,
          message: item.message,
          link: item.link,
          created_on: item.created_on,
        };
    }

  constructor(private api: ApiService) { }

    getAll() {
        return this.api.get({endpoint: `/notify`})
            .pipe(
                map(res => res as IApiResponseBody),
                map((res) => {
                    res.Data = res.Data && res.Data.map(item => {
                        // construct DocId and return data as received
                        return NotificationService.adapt(item);
                    });
                    return res.Data;
                }),
            );
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/notify/${DocId}`, useAuthUrl: true}).pipe(
            map((res: any) => NotificationService.adapt(res.Data)),
        );
    }

    update(param: { DocId: string; }) {
        return this.api.patch({endpoint: `/notify/${param.DocId}`, body: {}});
    }

    delete(id: string) {
        return this.api.delete({endpoint: `/notify/${id}`});
    }
}
