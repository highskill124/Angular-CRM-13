import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CreateInteractionFormComponent} from '../create-interaction-form/create-interaction-form.component';
import {IInteraction} from '../../../../models/contact-interaction';
import {FormOperation} from '../../../../models/form-operation';

@Component({
    selector: 'app-add-interaction',
    templateUrl: './add-interaction.component.html',
    styleUrls: ['./add-interaction.component.scss']
})
export class AddInteractionComponent implements OnInit {

    @Input() parent_id: string;
    @Input() interaction: IInteraction;
    @Input() formOperation: FormOperation = 'create';

    @Output() onDismiss: EventEmitter<boolean | Partial<IInteraction>>
        = new EventEmitter<boolean | Partial<IInteraction>>();

    @ViewChild('createInteractionForm', {read: CreateInteractionFormComponent})
    public createInteractionForm: CreateInteractionFormComponent;

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
        return this.formOperation && this.formOperation === 'view' ? 'View Interaction' : 'Add Interaction';
    }

}
