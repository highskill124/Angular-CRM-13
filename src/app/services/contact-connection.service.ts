import { Injectable } from '@angular/core';
import {ApiService} from './api/api.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IServerDropdownOption, ServerDropdownOption} from '../models/server-dropdown';
import {DropdownGuids} from '../models/dropdown-guids.enum';
import {IContactConnection} from '../models/contact-connection';

@Injectable({
  providedIn: 'root'
})
export class ContactConnectionService {

    guids = DropdownGuids;

  static adapt(connection): IContactConnection {
        return {
                DocId: connection._id ? `relationship::${connection._id}` : connection.DocId,
                parentid: connection.parent,
                childid: connection.child,
                relationship: connection.relationship,
            };
    }

  constructor(private api: ApiService) { }

  create(connection: Partial<IContactConnection>) {
      return this.api.post({endpoint: `/contact/relationship`, body: connection}); /* .pipe(
          map((res: any) => {
              res.Data = ContactConnectionService.adapt(res.Data);
              console.log('connection service result ', res);
              return res;
          })
      ); */
  }

    relationshipTypes(): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/cblookup/${this.guids.RELATIONSHIP_TYPES}`, useAuthUrl: true}).pipe(
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
