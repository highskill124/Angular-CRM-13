import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../models/server-dropdown';

@Injectable({
  providedIn: 'root'
})
export class GuidService {


  constructor(private api: ApiService) { }

    getGuidData(guid: string): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/cblookup/${guid}`, useAuthUrl: true})
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
            );
    }
}
