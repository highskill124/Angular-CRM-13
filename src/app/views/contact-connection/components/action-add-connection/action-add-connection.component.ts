import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {IgxOverlayService, OverlayEventArgs} from 'igniteui-angular';
import {takeWhile} from 'rxjs/internal/operators/takeWhile';
import {filter} from 'rxjs/operators';
import {ModalAddConnectionComponent} from '../modal-add-connection/modal-add-connection.component';
import {IContactAddConnection} from '../../../../models/contact';

@Component({
    selector: 'app-action-add-connection',
    templateUrl: './action-add-connection.component.html',
    styleUrls: ['./action-add-connection.component.scss']
})
export class ActionAddConnectionComponent implements OnInit, OnDestroy {

    @Input() contact: IContactAddConnection;

    alive = true;

    constructor(@Inject(IgxOverlayService) private overlayService: IgxOverlayService) {
    }

    ngOnInit() {
        // console.log('contact passed in ', this.contact);
    }

    openDialog() {
        
        const overlayId = this.overlayService.attach( ModalAddConnectionComponent);
        this.overlayService.show(overlayId);

        this.overlayService.opened.pipe(
            takeWhile(_ => this.alive),
            filter(event => !!(event.componentRef && event.componentRef.instance)),
        )
            .subscribe(($overlayEvent: OverlayEventArgs) => {
                // @ts-ignore
                const componentInstance = <ModalAddConnectionComponent>$overlayEvent.componentRef.instance;
                componentInstance.contact = this.contact;
                componentInstance.onDismiss.pipe(
                    takeWhile(_ => this.alive),
                )
                    .subscribe($dismissEvent => {
                        this.overlayService.hide(overlayId);
                    });
            });
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

}
