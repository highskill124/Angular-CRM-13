import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../models/server-dropdown';

@Injectable({
  providedIn: 'root'
})
export class CouchbaseLookupService {

  constructor(private api: ApiService) { }

    getOptions(guid: string): Observable<IServerDropdownOption[]> {
        console.log('Lookup ID: ' + guid)
        const resp =  this.api.get({endpoint: `/cblookup/${guid}`, useAuthUrl: true})
            .pipe(
                map((res: any) => {
                    return res.Data.map(option => {
                        return {
                            name: option.name,
                            value: option.id,
                            selected: option.selected,
                        };
                    })
                }),
                tap(res => console.log(res)),
            );
        return resp;
    }
}
