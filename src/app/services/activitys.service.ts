import { date } from '@rxweb/reactive-form-validators';
import {Injectable} from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ApiService} from './api/api.service';
import {IApiResponseBody} from '../models/api-response-body';

@Injectable({
    providedIn: 'root'
})

export class ActivityService {

    constructor(private api: ApiService) { }

    getActivitys(type : string, userid : string, date: string) {
        return this.api.get({endpoint: `/activity/${type}/${userid}/${date}`, useAuthUrl: false}).pipe(
            map(res => res as IApiResponseBody),
            tap(res => console.log(res.Data)),
            map(res => res.Data)
          
        );
    }



}