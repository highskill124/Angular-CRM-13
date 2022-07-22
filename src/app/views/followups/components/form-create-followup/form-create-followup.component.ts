import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {shareReplay, takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {FormOperation} from '../../../../models/form-operation';
import {IFollowUp} from '../../../../models/follow-up';
import {FollowupService} from '../../../../services/followup.service';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {ContactsService} from '../../../../services/contacts/contacts.service';

@Component({
    selector: 'app-form-create-followup',
    templateUrl: './form-create-followup.component.html',
    styleUrls: ['./form-create-followup.component.scss'],
})
export class FormCreateFollowupComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    private _parentid: string;

    /**
     * Form state passed into component
     */
    private _formData: IFollowUp = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';

    @Input() leftButtonText;

    @Output() onSubmitSuccess: EventEmitter<IFollowUp> = new EventEmitter<IFollowUp>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;
    guids = DropdownGuids;

    flagToOptions$: Observable<Array<IServerDropdownOption>>;
    @Input() set parentid(DocId: string) {
        this._parentid = DocId;
        if (this.form) {
            this.form.get('parent_id').setValue(DocId);
        }
    }
    get parentid() {
        return this._parentid;
    }
    @Input() set formData(formData: IFollowUp) {
        this._formData = formData;
        if (this.form) {
            this.start_date.setValue(this.formData && this.formData.start_date && new Date(this.formData.start_date));
            this.end_date.setValue(this.formData && this.formData.end_date && new Date(this.formData.end_date));
            this.reminderTime.setValue(this.formData && this.formData.reminder_datetime && new Date(this.formData.reminder_datetime));
            this.reminderDate.setValue(this.formData && this.formData.reminder_datetime && new Date(this.formData.reminder_datetime));

            const formDataCopy = {...formData};
            formDataCopy.parent_id = this.parentid;
            // delete form state already update above
            delete formDataCopy.end_date;
            delete formDataCopy.start_date;
            delete formDataCopy.reminder_datetime;
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
        private contactsService: ContactsService,
        private followupService: FollowupService,
        private toasterService: ToasterService,
    ) {
        super();
    }

    ngOnInit() {
        this.flagToOptions$ = this.contactsService.followUpOptions(this.guids.FOLLOW_UP_METHODS).pipe(shareReplay());
        this.initForm();
    }

    get formIsReadOnly() {
        return this.formOperation && this.formOperation === 'view';
    }

    get start_date() {
        return this.form.get('start_date');
    }

    get end_date() {
        return this.form.get('end_date');
    }

    get method() {
        return this.form.get('method');
    }

    get reminder() {
        return this.form.get('reminder');
    }

    get reminderDate() {
        return this.form.get('reminder_date');
    }

    get reminderTime() {
        return this.form.get('reminder_time');
    }

    initForm() {
        this.form = this.fb.group({
            parent_id: [this.parentid && this.parentid, Validators.required],
            start_date: [this.formData && this.formData.start_date && new Date(this.formData.start_date), Validators.required],
            end_date: [this.formData && this.formData.end_date && new Date(this.formData.end_date), Validators.required],
            notes: [this.formData && this.formData.notes],
            flag_to: [this.formData && this.formData.flag_to],
            reminder: [this.formData && this.formData.reminder],
            reminder_date: [this.formData && this.formData.reminder_datetime && new Date(this.formData.reminder_datetime)],
            reminder_time: [this.formData && this.formData.reminder_datetime && new Date(this.formData.reminder_datetime)],
        });
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        if (formData.reminder_date) {
            const reminder_date = new Date(formData.reminder_date);
            if (formData.reminder_time) {
                reminder_date.setHours(new Date(formData.reminder_time).getHours());
                reminder_date.setMinutes(new Date(formData.reminder_time).getMinutes());
            }
            formData.reminder_datetime = reminder_date;
        }
        delete formData.reminder_date;
        delete formData.reminder_time;

        this.errors = this.messages = [];
        this.submitted = true;

        let operation$: Observable<any>;
        operation$ = this.formOperation === 'update' ?
            this.followupService.update({id: this.formData.DocId, formData}) :
            this.followupService.create(formData);

        operation$.pipe(
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
