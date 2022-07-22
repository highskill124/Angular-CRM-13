import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormOperation} from '../../../../models/form-operation';
import {FormCreatePhoneNumberComponent} from '../form-create-phone-number/form-create-phone-number.component';
import {IPhoneNumber} from '../../../../models/phone-number';

@Component({
    selector: 'app-modal-add-phone-number',
    templateUrl: './modal-add-phone-number.component.html',
    styleUrls: ['./modal-add-phone-number.component.scss']
})
export class ModalAddPhoneNumberComponent implements OnInit {

    @Input() parentId: string;

    private _phoneNumber: IPhoneNumber;

    @Input() formOperation: FormOperation = 'create';

    @Output() onDismiss: EventEmitter<boolean | IPhoneNumber> = new EventEmitter<boolean | IPhoneNumber>();

    @ViewChild('formCreate', {read: FormCreatePhoneNumberComponent})
    public formCreate: FormCreatePhoneNumberComponent;
    @Input() set phoneNumber(phoneNumber: IPhoneNumber) {
        this._phoneNumber = phoneNumber;
    }

    get phoneNumber() {
        return this._phoneNumber;
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
