import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GuidService } from '../../../../services/guid.service';

@Component({
    selector: 'app-create-task',
    templateUrl: './create-task.component.html',
    styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    guids = DropdownGuids;
    saveBttn: string;
    formOperation: string;
    formData: ITask = null;


    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';


    @Output() reloadGrid: EventEmitter<boolean> = new EventEmitter<boolean>();


    alive = true;
    parentId: string;

    statusOptions$: Observable<Array<IServerDropdownOption>>;
    categoryOptions$: Observable<Array<IServerDropdownOption>>;
    priorityOptions$: Observable<Array<IServerDropdownOption>>;
    sensitivityOptions$: Observable<Array<IServerDropdownOption>>;
    importanceOptions$: Observable<Array<IServerDropdownOption>>;
    passedDateTime: any;

    // importanceOptions: IServerDropdownOption[] = TaskImportanceOptions;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateTaskComponent>,
        private fb: FormBuilder,
        private taskService: TaskService,
        private toasterService: ToasterService,
        private guidService: GuidService
    )  {
    this.form = fb.group({
        parentId: [''],
        subject: [, Validators.required],
        body: [, Validators.required],
        priority: [''],
        createdDateTime: [''],
        completedDateTime: [''],
        dueDateTime: [''],
        startDateTime: [''],
        status: [''],
        importance: [''],
        sensitivity: [''],
        assignedTo: [''],
        categories: [''],
        reminder: [''],
        reminderDate: [''], //[this.formData && this.formData.reminderDateTime && new Date(this.formData.reminderDateTime)],
        reminderTime: [''],
        percentComplete: [''],
        recurrence: [''],
        hasAttachments: [''],
        // history: [this.formData && this.formData.history],
        outlook: [''],
    });
        this.statusOptions$ = this.guidService.getGuidData(this.guids.TASK_STATUS)
        this.priorityOptions$ = this.guidService.getGuidData(this.guids.TASK_PRIORITY)
        this.importanceOptions$ = this.guidService.getGuidData(this.guids.TASK_IMPORTANCE)
    }

    ngOnInit() {
        console.log(this.data)
        this.parentId = this.data.DocId ;
        if (this.data.mode === 'update') {
            this.saveBttn = 'Update'
            this.formOperation = 'Update Task'
            // this.saveBttn = 'Update'
           this.fetchTaskInfo(this.data.DocId)
         
        }
    
        if (this.data.mode === 'new') {
            this.saveBttn = 'Create'
            console.log(this.data)
            this.parentId = this.data.ParentId;
            console.log(this.parentId)
            this.form.controls['parentId'].patchValue(this.parentId)
            this.form.controls['priority'].patchValue('normal')
            this.form.controls['importance'].patchValue('normal')
            this.formOperation = 'Create New Task'
            // this.saveBttn = 'Create'
        }

        this._formOperation = this.data.mode
        this.form.get('reminder').valueChanges.subscribe(
            val => {
                if(val) {
                    let today = this.passedDateTime ? new Date(this.passedDateTime)  : new Date();
                    let rmDate = this.form.get('reminderDate'); 
                        if(!rmDate.value) rmDate.setValue(today);
                    let rmTime = this.form.get('reminderTime'); 
                        if(!rmTime.value) rmTime.setValue(today);
                } else {
                    this.form.patchValue({
                        reminderDate: '',
                        reminderTime: ''
                    })
                }
            }
        )
    }

    fetchTaskInfo( parentId: string) {
        console.log(parentId)
        this.taskService.fetch(parentId).subscribe(
            res =>  {
            this.formData = res;
            console.log(res);
            this.form.controls['parentId'].setValue(res.DocId)
            this.form.controls['body'].setValue(res.body)
            this.form.controls['subject'].setValue(res.subject)
            this.form.controls['status'].setValue(res.status)
            this.form.controls['startDateTime'].setValue( new Date(res.startDateTime))
            this.form.controls['dueDateTime'].setValue( new Date(res.dueDateTime))
            this.form.controls['importance'].setValue(res.importance)
            this.form.controls['sensitivity'].setValue(res.sensitivity)
            this.form.controls['priority'].setValue(res.priority)
            this.form.controls['percentComplete'].setValue(res.percentComplete)
            this.form.controls['assignedTo'].setValue(res.assignedTo)

            this.form.controls['outlook'].setValue(res.outlook)
            // Reminder Section
            if(res.reminderDateTime) {
                this.passedDateTime = new Date(res.reminderDateTime) 
            }
            this.form.controls['reminder'].setValue(res.reminder)
            this.form.controls['reminderDate'].setValue(new Date(res.reminderDateTime))
            this.form.controls['reminderTime'].setValue(new Date(res.reminderDateTime))


       
      
            // recurrence: [''],
            // hasAttachments: [''],
            // // history: [this.formData && this.formData.history],
            // outlook: [''],
            }
        )
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

        console.log(formData)

        let operation$: Observable<any>;
        operation$ = this.saveBttn === 'Update' ?
            this.taskService.update({DocId: formData.parentId, formData}) :
            this.taskService.create(formData);

        operation$
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);

                        this.saveBttn = 'Update';
                        this.form.markAsPristine()
                        this.reloadGrid.emit(true)

                    } else {

                        this.showMessages.error = true;
                        this.toasterService.pop('error', res.Message);
                        this.errors = [res.Message];
                    }
                },
                (error) => {
                    this.toasterService.pop('error', 'Something went wrong!', 'Please try again.');
                },
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }

    closeDialog() {
        this.dialogRef.close({mode: this.saveBttn , reload: this.submitted});
      }
}
