import {Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {switchMap, take, takeWhile, tap} from 'rxjs/operators';
import {ModalAddPhoneNumberComponent} from '../modal-add-phone-number/modal-add-phone-number.component';
import {DialogService} from '../../../../services/dialog.service';
import {AddPhoneNumberActionDirective} from '../../directives/add-phone-number-action.directive';
import {IPhoneNumber} from '../../../../models/phone-number';
import {FormOperation} from '../../../../models/form-operation';

@Component({
    selector: 'app-action-add-phone-number',
    templateUrl: './action-add-phone-number.component.html',
    styleUrls: ['./action-add-phone-number.component.scss']
})
export class ActionAddPhoneNumberComponent implements OnInit, OnDestroy {

    @Input() parentId: string;
    @Input() phoneNumber: IPhoneNumber;
    @Input() formOperation: FormOperation;

    @Output() onDismiss: EventEmitter<boolean | IPhoneNumber> = new EventEmitter<boolean | IPhoneNumber>();

    modalInstance: ModalAddPhoneNumberComponent;
    alive = true;

    // Read in our structural directives as TemplateRefs
    @ContentChild(AddPhoneNumberActionDirective, {read: TemplateRef}) addActionTemplate;

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    openDialog() {
        this.dialogService.open<ModalAddPhoneNumberComponent>({component: ModalAddPhoneNumberComponent})
            .pipe(
                takeWhile(_ => this.alive),
                take(1),
                switchMap(res => {
                    res.componentInstance.parentId = this.parentId;
                    if (this.phoneNumber) {
                        res.componentInstance.phoneNumber = this.phoneNumber;
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
