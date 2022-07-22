import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {EMPTY, Observable} from 'rxjs';
import {IMainContact} from '../models/contact';
import {ContactsService} from '../services/contacts/contacts.service';

@Injectable({
    providedIn: 'root'
})
export class MainContactResolver implements Resolve<IMainContact> {

    constructor(
        private contactsService: ContactsService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<IMainContact> | Observable<never> {
        return this.contactsService.fetch(route.paramMap.get('DocId'))
            .pipe(
                catchError(err => {
                    return EMPTY;
                }),
            );
    }
}
