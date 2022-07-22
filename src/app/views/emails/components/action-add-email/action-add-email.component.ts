import {Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {switchMap, take, takeWhile, tap} from 'rxjs/operators';
import {ModalAddEmailComponent} from '../modal-add-email/modal-add-email.component';
import {DialogService} from '../../../../services/dialog.service';
import {AddEmailActionDirective} from '../../directives/add-email-action.directive';
import {IEmail} from '../../../../models/email';
import {FormOperation} from '../../../../models/form-operation';

@Component({
    selector: 'app-action-add-email',
    templateUrl: './action-add-email.component.html',
    styleUrls: ['./action-add-email.component.scss']
})
export class ActionAddEmailComponent implements OnInit, OnDestroy {

    @Input() parentId: string;
    @Input() email: IEmail;
    @Input() formOperation: FormOperation;

    @Output() onDismiss: EventEmitter<boolean | IEmail> = new EventEmitter<boolean | IEmail>();

    modalInstance: ModalAddEmailComponent;
    alive = true;

    // Read in our structural directives as TemplateRefs
    @ContentChild(AddEmailActionDirective, {read: TemplateRef}) addActionTemplate;

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    openDialog() {
        this.dialogService.open<ModalAddEmailComponent>({component: ModalAddEmailComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(res => {
                    res.componentInstance.parentId = this.parentId;
                    if (this.email) {
                        res.componentInstance.email = this.email;
                    }
                    if (this.formOperation) {
                        res.componentInstance.formOperation = this.formOperation;
                    }
                    this.modalInstance = res.componentInstance;
                    return this.modalInstance.onDismiss.pipe(
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
