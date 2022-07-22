import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IBaseNote} from '../../../../models/base-note';
import {FormCreateNoteComponent} from '../form-create-note/form-create-note.component';
import {FormOperation} from '../../../../models/form-operation';

@Component({
    selector: 'app-modal-add-note',
    templateUrl: './modal-add-note.component.html',
    styleUrls: ['./modal-add-note.component.scss']
})
export class ModalAddNoteComponent implements OnInit {

    @Input() parentid: string;
    @Input() note: IBaseNote;
    @Input() formOperation: FormOperation = 'create';

    @Output() onDismiss: EventEmitter<boolean | IBaseNote> = new EventEmitter<boolean | IBaseNote>();

    @ViewChild('formCreateNote', {read: FormCreateNoteComponent})
    public formCreateNote: FormCreateNoteComponent;

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
        return this.formOperation && this.formOperation === 'view' ? 'View Note' : 'Add Note';
    }

}
