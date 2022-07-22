import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormOperation} from '../../../../models/form-operation';
import {IList} from '../../../../models/list';
import {ListFormComponent} from '../list-form/list-form.component';

@Component({
    selector: 'app-list-modal',
    templateUrl: './list-modal.component.html',
    styleUrls: ['./list-modal.component.scss']
})
export class ListModalComponent implements OnInit {

    private _list: IList;

    @Input() formOperation: FormOperation = 'create';

    @Output() onDismiss: EventEmitter<boolean | IList> = new EventEmitter<boolean | IList>();

    @ViewChild('formCreate', {read: ListFormComponent})
    public formCreate: ListFormComponent;

    @Input() set list(list: IList) {
        this._list = list;
    }

    get list() {
        return this._list;
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
