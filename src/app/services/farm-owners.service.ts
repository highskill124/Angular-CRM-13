import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {map} from 'rxjs/operators';
import {IFarmOwners} from '../models/farm';

@Injectable({
  providedIn: 'root'
})
export class FarmOwnersService {

  static adapt(data): IFarmOwners {
        return {
            id: data.id,
            owner1FName: data.owner1FName,
          owner1FullName: data.owner1FullName,
          owner1LName: data.owner1LName,
          owner1MName: data.owner1MName,
          owner1SpouseFName: data.owner1SpouseFName,
          owner1SpouseLName: data.owner1SpouseLName,
          owner1SpouseMName: data.owner1SpouseMName,
          owner2FName: data.owner2FName,
          owner2FullName: data.owner2FullName,
          owner2LName: data.owner2LName,
          owner2MName: data.owner2MName,
          owner2SpouseFName: data.owner2SpouseFName,
          owner2SpouseLName: data.owner2SpouseLName,
          owner2SpouseMName: data.owner2SpouseMName,
          ownerNameFormatted: data.ownerNameFormatted,
          ownerNameS: data.ownerNameS,
        };
    }

  constructor(private api: ApiService) { }

  create(formData: Partial<IFarmOwners>) {
      return this.api.post({endpoint: `/farms/owners`, body: formData, useAuthUrl: true})
          .pipe(
              map((res: any) => {
                  res.Data = FarmOwnersService.adapt(res.Data);
                  return res;
              })
          );
  }

    fetch(DocId) {
        return this.api.get({endpoint: `/farm-owners/${DocId}`, useAuthUrl: true}).pipe(
            map((res: any) => FarmOwnersService.adapt(res.Data)),
        );
    }

    update(param: { formData: IFarmOwners }) {
        return this.api.post({endpoint: `/farms/owners`, body: param.formData});
    }

    delete(farmId: string) {
        return this.api.delete({endpoint: `/farms/owners/${farmId}`, useAuthUrl: true});
    }
}
