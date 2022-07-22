import {Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {takeWhile} from 'rxjs/internal/operators/takeWhile';
import {switchMap, take, tap} from 'rxjs/operators';
import {DialogService} from '../../../../services/dialog.service';
import {AddFollowupActionDirective} from '../../directives/add-followup-action.directive';
import {IFollowUp} from '../../../../models/follow-up';
import {ModalAddFollowupComponent} from '../modal-add-followup/modal-add-followup.component';

@Component({
    selector: 'app-action-add-followup',
    templateUrl: './action-add-followup.component.html',
    styleUrls: ['./action-add-followup.component.scss']
})
export class ActionAddFollowupComponent implements OnInit, OnDestroy {

    @Input() parentid: string;

    @Output() onDismiss: EventEmitter<boolean | IFollowUp> = new EventEmitter<boolean | IFollowUp>();

    modalAddFollowupInstance: ModalAddFollowupComponent;
    alive = true;

    // Read in our structural directives as TemplateRefs
    @ContentChild(AddFollowupActionDirective, {read: TemplateRef}) addFollowupActionTemplate;

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    openDialog() {
        this.dialogService.open<ModalAddFollowupComponent>({component: ModalAddFollowupComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(res => {
                    res.componentInstance.parentid = this.parentid;
                    this.modalAddFollowupInstance = res.componentInstance;
                    return this.modalAddFollowupInstance.onDismiss.pipe(
                        tap(_ => {
                            res.dialogService.overlayService.hide(res.overlayId);
                        })
                    );
                })
            )
            .subscribe($dismissEvent => {
                this.onDismiss.emit($dismissEvent);

            });
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

}
