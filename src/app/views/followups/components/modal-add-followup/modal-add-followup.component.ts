import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormOperation} from '../../../../models/form-operation';
import {IFollowUp} from '../../../../models/follow-up';
import {FormCreateFollowupComponent} from '../form-create-followup/form-create-followup.component';

@Component({
    selector: 'app-modal-add-followup',
    templateUrl: './modal-add-followup.component.html',
    styleUrls: ['./modal-add-followup.component.scss']
})
export class ModalAddFollowupComponent implements OnInit {

    @Input() parentid: string;
    @Input() formData: IFollowUp;
    @Input() formOperation: FormOperation = 'create';

    @Output() onDismiss: EventEmitter<boolean | IFollowUp> = new EventEmitter<boolean | IFollowUp>();

    @ViewChild('formCreateFollowup', {read: FormCreateFollowupComponent})
    public formCreateFollowup: FormCreateFollowupComponent;

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

    get containerTitle() {
        return this.formOperation && this.formOperation === 'view' ? 'View Followup' : 'Add Followup';
    }

}
