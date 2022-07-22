import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {CanDeactivate} from '@angular/router';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}


/*@Injectable({
  providedIn: 'root',
})*/
@Injectable()
export class DeactivateGuardService implements  CanDeactivate<CanComponentDeactivate> {

    canDeactivate(component: CanComponentDeactivate) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }
}
