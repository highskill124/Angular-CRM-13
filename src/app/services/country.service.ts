import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IServerDropdownOption, ServerDropdownOption} from '../models/server-dropdown';
import {map} from 'rxjs/operators';
import {ApiService} from './api/api.service';

@Injectable({
    providedIn: 'root'
})
export class CountryService {

    constructor(public api: ApiService) {
    }

    fetchAll(): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: '/cblookup/D9D29C2C-0A3F-40C7-BFBA-823B8EAD5CD5', useAuthUrl: true}).pipe(
            map((res: any) => {
                return res.Data.map(option => {
                    return new ServerDropdownOption({
                        value: option.id,
                        name: option.name,
                        selected: option.selected,
                    })
                })
            }),
        );
    }
}
