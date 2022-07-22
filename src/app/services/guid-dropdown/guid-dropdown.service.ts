import { Injectable } from '@angular/core';
import {map, retry} from 'rxjs/operators';
import {ServerDropdownOption} from '../../models/server-dropdown';
import {ApiService} from '../api/api.service';

@Injectable({providedIn: 'root'})
export class GuidDropdownService {

  constructor(public api: ApiService) { }

  fetchData(guid) {
    return this.api.get({endpoint: `/dropdown/${guid}`, useAuthUrl: true})
      .pipe(
        map((options: any) => {
          return options.Data.map((option) => {
            return new ServerDropdownOption({
              value: option.id,
              name: option.text,
              selected: option.selected === 1,
            });
          });
        }),
        retry(2),
      );
  }

}
