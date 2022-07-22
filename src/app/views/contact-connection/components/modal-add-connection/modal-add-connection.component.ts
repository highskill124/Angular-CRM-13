import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IContactAddConnection} from '../../../../models/contact';

@Component({
    selector: 'app-modal-add-connection',
    templateUrl: './modal-add-connection.component.html',
    styleUrls: ['./modal-add-connection.component.scss']
})
export class ModalAddConnectionComponent implements OnInit {

    @Input() contact: IContactAddConnection;

    @Output() onDismiss: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
    }

    dismiss() {
        this.onDismiss.emit(true);
    }

}
