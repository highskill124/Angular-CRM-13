import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {shareReplay, takeWhile} from 'rxjs/operators';
import {FormOperation} from '../../../../models/form-operation';
import {IFollowUp} from '../../../../models/follow-up';
import {FollowupService} from '../../../../services/followup.service';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { date } from '@rxweb/reactive-form-validators';


@Component({
    selector: 'app-create-followup',
    templateUrl: './create-followup.component.html',
    styleUrls: ['./create-followup.component.scss'],
})
export class CreateFollowUpComponent implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    guids = DropdownGuids;
    saveBttn: string
    passedDateTime:any;

    flagToOptions$: Observable<Array<IServerDropdownOption>>;


    /**
     * Form state passed into component
     */
    private _formData: IFollowUp = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';


    @Output() reloadGrid: EventEmitter<boolean> = new EventEmitter<boolean>();


    alive = true;
    parentId: string;

   
    // @Input() set parentId(contactId: string) {
    //     this._parentId = contactId;
    //     if (this.form) {
    //         this.form.get('parent_id').setValue(contactId);
    //     }
    // }

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateFollowUpComponent>,
        private fb: FormBuilder,
        private followupService: FollowupService,
        private contactsService: ContactsService,
        private couchbaseLookupService: CouchbaseLookupService,
        private toasterService: ToasterService,
    )  {
    this.form = fb.group({

        parent_id: ['', Validators.required],
        DocId: [''],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
        notes: ['', Validators.required],
        flag_to: ['', Validators.required],
        reminder: [''],
        reminder_date: [''],
        reminder_time: [''],
        completed: ['']
    });

    this.form.get('reminder').valueChanges.subscribe(
        val => {
            if(val) {
                let today = this.passedDateTime ? new Date(this.passedDateTime)  : new Date();
                let rmDate = this.form.get('reminder_date'); 
                    if(!rmDate.value) rmDate.setValue(today);
                let rmTime = this.form.get('reminder_time'); 
                    if(!rmTime.value) rmTime.setValue(today);
            } else {
                this.form.patchValue({
                    reminder_date: '',
                    reminder_time: ''
                })
            }
        }
    )
        //this.statusOptions$ = this.taskService.statusOptions();
        //this.priorityOptions$ = this.taskService.priorityOptions();
    }

    ngOnInit() {
        this.flagToOptions$ = this.couchbaseLookupService.getOptions(this.guids.FOLLOW_UP_METHODS).pipe(shareReplay());
        this.parentId = this.data.DocId ;
        if (this.data.mode === 'update') {
            this.saveBttn = 'Update'
            console.log('This will be an Update')
            console.log(this.data.DocId )
            // this.saveBttn = 'Update'
           this.fetchTaskInfo(this.data.DocId)
         
        }
    
        if (this.data.mode === 'new') {
            this.saveBttn = 'Create'
            this.parentId = this.data.ParentId;
            this.form.controls['parent_id'].setValue(this.parentId);
            let today = new Date();
            let tomorrow = new Date();
            tomorrow.setDate(today.getDate()+1);
            this.form.patchValue({ start_date: today, end_date: tomorrow })
            console.log('This will be a New Task')
            // this.saveBttn = 'Create'
        }

        this._formOperation = this.data.mode
     
    }

    fetchTaskInfo( parentId: string) {
        console.log(parentId)
        this.followupService.fetch(parentId).subscribe(
            res =>  {
            console.log(res)
            this.form.controls['completed'].setValue(res.completed)
            this.form.controls['parent_id'].setValue(res.parent_id)
            this.form.controls['notes'].setValue(res.notes)
            this.form.controls['flag_to'].setValue(res.flag_to)
            this.form.controls['DocId'].setValue(res.DocId)
            if (res.start_date){
            this.form.controls['start_date'].setValue( new Date(res.start_date))
            }
            if(res.end_date) {
                this.form.controls['end_date'].setValue( new Date(res.end_date))
            }

            // // Reminder Section
            this.form.controls['reminder'].setValue(res.reminder)
            if(res.reminder_datetime){
            this.passedDateTime = res.reminder_datetime;
            this.form.controls['reminder_date'].setValue( new Date(res.reminder_datetime))
            this.form.controls['reminder_time'].setValue( new Date(res.reminder_datetime))
            
            }
           
            },
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

        let operation$: Observable<any>;
        operation$ = this.saveBttn === 'Update' ?
            this.followupService.update({ id: formData.DocId, formData}) :
            this.followupService.create(formData);
 
        operation$
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        if ( this.saveBttn === 'Create'){
                            this.form.controls['DocId'].setValue(res.Data)
                        }

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
