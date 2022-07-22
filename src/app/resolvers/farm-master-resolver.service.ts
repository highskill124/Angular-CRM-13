import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {EMPTY, Observable} from 'rxjs';
import {FarmService} from '../services/farm/farm.service';
import {IFarmMaster} from '../models/farm';

@Injectable({
    providedIn: 'root'
})
export class FarmMasterResolver implements Resolve<IFarmMaster> {

    constructor(
        private farmService: FarmService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<IFarmMaster> | Observable<never> {
        const data = this.farmService.farmMaster(route.paramMap.get('DocId'))
            .pipe(
                catchError(err => {
                    return EMPTY;
                }),
            );
        // tslint:disable-next-line: no-debugger
        data.subscribe();
        console.log(data)
        return data;
    }
}
