import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {FormOperation} from '../../../../models/form-operation';
import {ITask} from '../../../../models/task';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {TaskService} from '../../../../services/task.service';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {TaskImportanceOptions} from '../../../../models/task-importance-options';
import { GuidService } from '../../../../services/guid.service';

@Component({
    selector: 'app-form-create-task',
    templateUrl: './form-create-task.component.html',
    styleUrls: ['./form-create-task.component.scss'],
})
export class FormCreateTaskComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    guids = DropdownGuids;

    private _parentId: string;

    /**
     * Form state passed into component
     */
    private _formData: ITask = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';

    @Input() leftButtonText;

    @Output() onSubmitSuccess: EventEmitter<ITask> = new EventEmitter<ITask>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;

    statusOptions$: Observable<Array<IServerDropdownOption>>;
    categoryOptions$: Observable<Array<IServerDropdownOption>>;
    priorityOptions$: Observable<Array<IServerDropdownOption>>;
    sensitivityOptions$: Observable<Array<IServerDropdownOption>>;
    importanceOptions$: Observable<Array<IServerDropdownOption>>;
    @Input() set parentId(contactId: string) {
        this._parentId = contactId;
        if (this.form) {
            this.form.get('parent_id').setValue(contactId);
        }
    }
    get parentId() {
        return this._parentId;
    }
    @Input() set formData(formData: ITask) {
        this._formData = formData;
        if (this.form) {
            this.startDateTime.setValue(this.formData && this.formData.startDateTime && new Date(this.formData.startDateTime));
            this.dueDateTime.setValue(this.formData && this.formData.dueDateTime && new Date(this.formData.dueDateTime));
            this.reminderTime.setValue(this.formData && this.formData.reminderDateTime && new Date(this.formData.reminderDateTime));
            this.reminderDate.setValue(this.formData && this.formData.reminderDateTime && new Date(this.formData.reminderDateTime));

            const formDataCopy = {...formData};
            formDataCopy.parentId = this.parentId;
            // delete form state already update above
            delete formDataCopy.startDateTime;
            delete formDataCopy.dueDateTime;
            this.form.patchValue(formDataCopy);
        }
    }
    get formData() {
        return this._formData;
    }
    @Input() set formOperation(formOperation: FormOperation) {
        this._formOperation = formOperation;
    }
    get formOperation() {
        return this._formOperation;
    }

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private toasterService: ToasterService,
        private guidService: GuidService
    ) {
        super();
        this.statusOptions$ = this.guidService.getGuidData(this.guids.TASK_STATUS)
        this.priorityOptions$ = this.guidService.getGuidData(this.guids.TASK_PRIORITY)
        this.importanceOptions$ = this.guidService.getGuidData(this.guids.TASK_IMPORTANCE)
    }

    ngOnInit() {
        this.initForm();
    }

    get formIsReadOnly() {
        return this.formOperation && this.formOperation === 'view';
    }

    get reminder() {
        return this.form.get('reminder');
    }

    get outlook() {
        return this.form.get('outlook');
    }

    get reminderDate() {
        return this.form.get('reminderDate');
    }

    get reminderTime() {
        return this.form.get('reminderTime');
    }

    get startDateTime() {
        return this.form.get('startDateTime');
    }

    get dueDateTime() {
        return this.form.get('dueDateTime');
    }

    get sensitivity() {
        return this.form.get('sensitivity');
    }

    initForm() {
        // const activeImportance = this.importanceOptions.find(option => option.selected);

        console.log(this.formData);
        this.form = this.fb.group({
            
            parent_id: [this.parentId && this.parentId, Validators.required],
            subject: [this.formData && this.formData.subject, Validators.required],
            body: [this.formData && this.formData.body, Validators.required],
            method: [this.formData && this.formData.method],
            priority: [this.formData && this.formData.priority],
            createdDateTime: [this.formData && this.formData.createdDateTime],
            completedDateTime: [this.formData && this.formData.completedDateTime],
            dueDateTime: [this.formData && this.formData.dueDateTime && new Date(this.formData.dueDateTime)],
            startDateTime: [this.formData && this.formData.startDateTime && new Date(this.formData.startDateTime)],
            status: [this.formData && this.formData.status],
            importance: [this.formData && this.formData.importance],
            sensitivity: [this.formData && this.formData.sensitivity],
            assignedTo: [this.formData && this.formData.assignedTo],
            categories: [this.formData && this.formData.categories],
            reminder: [this.formData && this.formData.reminder],
            reminderDate: [this.formData && this.formData.reminderDateTime && new Date(this.formData.reminderDateTime)],
            reminderTime: [this.formData && this.formData.reminderDateTime && new Date(this.formData.reminderDateTime)],
            percentComplete: [this.formData && this.formData.percentComplete],
            recurrence: [this.formData && this.formData.recurrence],
            hasAttachments: [this.formData && this.formData.hasAttachments],
            // history: [this.formData && this.formData.history],
            outlook: [this.formData && this.formData.outlook],
        });
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        if (formData.reminderDate) {
            const reminderDate = new Date(formData.reminderDate);
            if (formData.reminderTime) {
                reminderDate.setHours(new Date(formData.reminderTime).getHours());
                reminderDate.setMinutes(new Date(formData.reminderTime).getMinutes());
            }
            formData.reminderDateTime = reminderDate;
        }
        delete formData.reminderDate;
        delete formData.reminderTime;

        this.errors = this.messages = [];
        this.submitted = true;

        let operation$: Observable<any>;
        operation$ = this.formOperation === 'update' ?
            this.taskService.update({DocId: this.formData.DocId, formData}) :
            this.taskService.create(formData);

        operation$
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.submitted = false;
                        this.onSubmitSuccess.emit(formData);
                        this.form.reset();
                    } else {
                        this.submitted = false;
                        this.showMessages.error = true;
                        this.toasterService.pop('error', res.Message);
                        this.errors = [res.Message];
                    }
                },
                (error) => {
                    this.submitted = false;
                    this.toasterService.pop('error', 'Something went wrong!', 'Please try again.');
                },
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
