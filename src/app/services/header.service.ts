import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class StateService {
  private currentPagetitle: Subject<string> = new Subject<string>();
  getTitle(): Observable<string> {
    return this.currentPagetitle;
  }
  setTitle(title: string): void {
    this.currentPagetitle.next(title);
  }

}
