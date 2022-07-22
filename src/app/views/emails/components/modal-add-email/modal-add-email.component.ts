import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormOperation} from '../../../../models/form-operation';
import {FormCreateEmailComponent} from '../form-create-email/form-create-email.component';
import {IEmail} from '../../../../models/email';

@Component({
    selector: 'app-modal-add-email',
    templateUrl: './modal-add-email.component.html',
    styleUrls: ['./modal-add-email.component.scss']
})
export class ModalAddEmailComponent implements OnInit {

    @Input() parentId: string;

    private _email: IEmail;

    @Input() formOperation: FormOperation = 'create';

    @Output() onDismiss: EventEmitter<boolean | IEmail> = new EventEmitter<boolean | IEmail>();

    @ViewChild('formCreate', {read: FormCreateEmailComponent})
    public formCreate: FormCreateEmailComponent;
    @Input() set email(email: IEmail) {
        this._email = email;
    }

    get email() {
        return this._email;
    }

    constructor() {
    }

    ngOnInit() {
    }

    dismiss($event) {
        this.onDismiss.emit($event);
    }

    get leftButtonText() {
        return this.formOperation && this.formOperation === 'view' ? 'Close' : 'Cancel';
    }

}
