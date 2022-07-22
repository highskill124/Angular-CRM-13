import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map} from 'rxjs/operators';
import {IApiResponseBody} from '../models/api-response-body';
import {IList} from '../models/list';

@Injectable({
    providedIn: 'root'
})
export class ListService {

    static adapt(list): IList {
        return {
            DocId: list.DocId,
            name: list.name,
            description: list.description,
            category: list.categories,
            items: list.items,
        };
    }

    constructor(private api: ApiService) {
    }

    create(list: Partial<IList>) {
        return this.api.post({endpoint: `/list`, body: list})
            .pipe(
                map(res => res as IApiResponseBody),
                map((res: IApiResponseBody) => {
                    res.Data = ListService.adapt(res.Data);
                    return res;
                })
            );
    }

    fetch(DocId) {
        return this.api.get({endpoint: `/list/${DocId}`}).pipe(
            map(res => res as IApiResponseBody),
            map((res: IApiResponseBody) => ListService.adapt(res.Data[0])),
        );
    }

    delete(id: string) {
        return this.api.delete({endpoint: `/list/${id}`});
    }
}
