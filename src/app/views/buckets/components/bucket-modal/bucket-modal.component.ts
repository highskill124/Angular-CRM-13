import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormOperation} from '../../../../models/form-operation';
import {BucketFormComponent} from '../bucket-form/bucket-form.component';
import {IBucket} from '../../../../models/bucket';

@Component({
    selector: 'app-bucket-modal',
    templateUrl: './bucket-modal.component.html',
    styleUrls: ['./bucket-modal.component.scss']
})
export class BucketModalComponent implements OnInit {

    // @Input() parentId: string;

    @Input() bucket: IBucket;

    @Input() formOperation: FormOperation = 'create';

    @Output() onDismiss: EventEmitter<boolean | IBucket> = new EventEmitter<boolean | IBucket>();

    @ViewChild('formCreate', {read: BucketFormComponent})
    public formCreate: BucketFormComponent;

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
