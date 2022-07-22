import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { shareReplay, takeWhile } from 'rxjs/operators';
import { IInteraction } from '../../../../models/contact-interaction';
import { InteractionService } from '../../../../services/interaction.service';
import { IServerDropdownOption } from '../../../../models/server-dropdown';
import { Observable } from 'rxjs';
import { FormOperation } from '../../../../models/form-operation';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CouchbaseLookupService } from '../../../../services/couchbase-lookup.service';
import { DropdownGuids } from '../../../../models/dropdown-guids.enum';
import { MatDialogComponent } from '../../../../modules/mat-dialog/mat-dialog.component';
@Component({
    selector: 'app-create-interaction',
    templateUrl: './create-interaction.component.html',
    styleUrls: ['./create-interaction.component.scss'],
})
export class CreateInteractionComponent implements OnInit, OnDestroy {
    @Output() reloadGrid: EventEmitter<boolean> = new EventEmitter<boolean>();

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    saveBttn: string;
    parentId: string;
    reminderTitle = 'No Reminder';
    customReminder = false;
    guids = DropdownGuids;
    formOperation: string;
    followup: boolean;

    @Input() leftButtonText;

    interactionMethods$: Observable<IServerDropdownOption[]>;
    reminderOptions$: Observable<IServerDropdownOption[]>;
    flagToOptions$: Observable<Array<IServerDropdownOption>>;

    alive = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateInteractionComponent>,
        private fb: FormBuilder,
        private interactionsService: InteractionService,
        private couchbaseLookupService: CouchbaseLookupService,
        private toasterService: ToasterService
    ) {}
    fetchData(DocId: string) {
        this.interactionsService.fetch(DocId).subscribe((res) => {
            console.log(res);
            this.form.controls['parent_id'].setValue(res.parent_id);
            this.form.controls['notes'].setValue(res.notes);
            this.form.controls['method'].setValue(res.type);
            this.form.controls['subject'].setValue(res.subject);
            this.form.controls['DocId'].setValue(res.DocId);

            if (res.time) {
                this.form.controls['date'].setValue(new Date(res.time));
                this.form.controls['time'].setValue(new Date(res.time));

                if (res.followup_id && res.followup_id !== '') {
                    this.form.controls['followup_id'].setValue(res.followup_id);
                    this.form.controls['reminder_date'].setValue(
                        new Date(res.reminder_date)
                    );
                    this.form.controls['reminder_time'].setValue(
                        new Date(res.reminder_time)
                    );
                    this.form.controls['flag_to'].setValue(res.flag_to);
                    this.customReminder = true;
                    this.reminderTitle = 'Custom Reminder';
                    this.form.controls['followup'].setValue(true);
                }
            }
        });
    }

    ngOnInit() {
        this.interactionMethods$ = this.couchbaseLookupService
            .getOptions(this.guids.INTERACTION_METHODS)
            .pipe(shareReplay());
        this.reminderOptions$ = this.couchbaseLookupService
            .getOptions(this.guids.REMINDER_INTERVAL)
            .pipe(shareReplay());
        this.flagToOptions$ = this.couchbaseLookupService
            .getOptions(this.guids.FOLLOW_UP_METHODS)
            .pipe(shareReplay());

        this.initForm();

        if (this.data.mode === 'update') {
            this.saveBttn = 'Update';
            console.log('This will be an Update');
            console.log(this.data.DocId);

            this.fetchData(this.data.DocId);
        }

        if (this.data.mode === 'new') {
            this.saveBttn = 'Create';
            this.parentId = this.data.ParentId;
            this.form.controls['parent_id'].setValue(this.parentId);
            this.form.controls['date'].setValue(new Date());
            this.form.controls['time'].setValue(new Date());
            console.log('This will be a New Task');
        }

        this.formOperation = this.data.mode;
    }

    initForm() {
        this.form = this.fb.group({
            parent_id: ['', [Validators.required]],
            method: ['', [Validators.required]],
            DocId: [''],
            followup_id: [''],
            date: ['', [Validators.required]],
            time: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            notes: [''],
            reminder_date: [''],
            reminder_time: [''],
            flag_to: [''],
            followup: [''],
        });
    }

    create(form) {
        console.log(form);
        let formData = form.value
        if (formData.date) {
            const time = new Date(formData.date);
            if (formData.time) {
                time.setHours(new Date(formData.time).getHours());
                time.setMinutes(new Date(formData.time).getMinutes());
            }
            formData.date = time;
            formData.time = time;
        }

        this.errors = this.messages = [];
        this.submitted = true;

        let operation$: Observable<any>;
        operation$ =
            this.formOperation === 'update'
                ? this.interactionsService.update({
                      DocId: formData.DocId,
                      formData,
                  })
                : this.interactionsService.create(formData);

        operation$.pipe(takeWhile((_) => this.alive)).subscribe(
            (res: any) => {
                // console.log(res);
                if (res.Success === true) {
                    this.toasterService.pop('success', 'Success!', res.Message);
                    this.reloadGrid.emit(true);
                    this.form.markAsPristine();
                    this.submitted = false;
                } else {
                    this.submitted = false;
                    this.showMessages.error = true;
                    this.toasterService.pop('error', res.Message);
                    this.errors = [res.Message];
                }
            },
            (error) => {
                this.submitted = false;
                this.toasterService.pop(
                    'error',
                    'Something went wrong!',
                    'Please try again.'
                );
            }
        );
    }

    onSelect(e) {


        if(this.reminderTitle !== e.newSelection.value.name){

            console.log('Old Title : ' + this.reminderTitle)
            console.log('New Title : ' + e.newSelection.value.name)
            console.log('User Changed the Reminder')
            this.form.markAsDirty()
        }

        this.reminderTitle = e.newSelection.value.name;
        // tslint:disable: radix
        // Split Value by :
        const splitString = e.newSelection.value.value.split(':');
        const interval = parseInt(splitString[1]);
        const period = splitString[0];

        if (period === 'C' && interval === 0) {
            this.customReminder = false;
            this.followup = false;
            this.setFollowupValidators(false);
            this.form.controls['reminder_date'].setValue(null);
            this.form.controls['reminder_time'].setValue(null);
            this.form.controls['flag_to'].setValue(null);
            // TODO delete the Reminder
        } else if (period === 'C' && interval === 1) {
            console.log('this will be custom date');
        } else {
            this.customReminder = true;
            this.followup = true;
            this.setFollowupValidators(true);
            this.setReminderValues(interval, period);
        }

        this.form.controls['followup'].setValue(this.followup);
    }

    ngOnDestroy() {
        this.alive = false;
    }

    setReminderValues(interval: number, period: string) {
        console.log('Interval : ' + interval);
        let reminderDate: Date;
        reminderDate = new Date();

        if (period === 'D') {
            reminderDate.setDate(reminderDate.getDate() + interval);
        } else if (period === 'M') {
            reminderDate.setMonth(reminderDate.getMonth() + interval);
        } else if (period === 'Y') {
            reminderDate.setFullYear(reminderDate.getFullYear() + interval);
        }
        reminderDate.setHours(8, 0, 0);

        this.form.controls['reminder_date'].setValue(new Date(reminderDate));
        this.form.controls['reminder_time'].setValue(new Date(reminderDate));
    }
    closeDialog() {

        if(this.form.dirty === true){
            const dialogRef = this.dialog.open(MatDialogComponent,
                {
                    data: {message: 'Are you sure you want to exit without saving Data ?', title: 'Unsaved Data', rightButtonText: 'No'},
                    disableClose: true, width: '500px', position: {
                        top: '50px'
                    },
                    panelClass:'inner-no-pad-dialog',
                    autoFocus: false
                })
            dialogRef.afterOpened().subscribe(
                    opend => {
                        document.querySelector('.inner-no-pad-dialog').parentElement.classList.add('no-relv')
                    }
                )
            dialogRef.afterClosed().subscribe(result => {
                if (result === true) {
                    console.log('Will Exit without Saving');
                    this.dialogRef.close({ mode: this.saveBttn, reload: this.submitted })
                } else {
                }
            });

        } else {
        this.dialogRef.close({ mode: this.saveBttn, reload: this.submitted });
        }
    }
    setFollowupValidators(required: boolean) {
        const reminder_date = this.form.get('reminder_date');
        const reminder_time = this.form.get('reminder_time');
        const flag_to = this.form.get('flag_to');

        if (required === true) {
            reminder_date.setValidators([Validators.required]);
            reminder_time.setValidators([Validators.required]);
            flag_to.setValidators([Validators.required]);
        }

        if (required === false) {
            reminder_date.setValidators(null);
            reminder_time.setValidators(null);
            flag_to.setValidators(null);
        }

        reminder_date.updateValueAndValidity();
        reminder_time.updateValueAndValidity();
        flag_to.updateValueAndValidity();
    }
}
