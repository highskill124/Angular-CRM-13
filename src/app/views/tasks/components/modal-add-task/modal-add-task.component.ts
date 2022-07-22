import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormOperation} from '../../../../models/form-operation';
import {FormCreateTaskComponent} from '../form-create-task/form-create-task.component';
import {ITask} from '../../../../models/task';

@Component({
    selector: 'app-modal-add-task',
    templateUrl: './modal-add-task.component.html',
    styleUrls: ['./modal-add-task.component.scss']
})
export class ModalAddTaskComponent implements OnInit {

    @Input() parentId: string;

    private _task: ITask;

    @Input() formOperation: FormOperation = 'create';

    @Output() onDismiss: EventEmitter<boolean | ITask> = new EventEmitter<boolean | ITask>();

    @ViewChild('formCreateTask', {read: FormCreateTaskComponent})
    public formCreateTask: FormCreateTaskComponent;

    @Input() set task(task: ITask) {
        this._task = task;
    }

    get task() {
        return this._task;
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
