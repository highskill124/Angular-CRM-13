import {Inject, Injectable, OnDestroy, Type} from '@angular/core';
import {filter, map, takeWhile} from 'rxjs/operators';
import {IgxOverlayService, OverlayEventArgs} from 'igniteui-angular';
import {Observable} from 'rxjs';

export interface IDialogOpenedResult<T = {}> {
    componentInstance: T,
    overlayId: string,
    dialogService: DialogService,
}

@Injectable({
  providedIn: 'root'
})
export class DialogService implements OnDestroy {

    private alive = true;

  constructor(@Inject(IgxOverlayService) public overlayService: IgxOverlayService) { }

    open<T = {}>(params: {component: Type<T>}): Observable<IDialogOpenedResult<T>> {
        const overlayId = this.overlayService.attach( params.component);
        this.overlayService.show(overlayId);

        return this.overlayService.opened.pipe(
            takeWhile(_ => this.alive),
            filter(event => !!(event.componentRef && event.componentRef.instance)),
            map(($overlayEvent: OverlayEventArgs) => {

                const componentInstance = <T>$overlayEvent.componentRef.instance;
        

                return { componentInstance, overlayId, dialogService: this } ;
            })
        );
    }

    ngOnDestroy(): void {
      this.alive = false;
    }
}
