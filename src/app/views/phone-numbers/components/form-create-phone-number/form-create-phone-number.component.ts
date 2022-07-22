import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {FormOperation} from '../../../../models/form-operation';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {IPhoneNumber} from '../../../../models/phone-number';
import {PhoneNumberService} from '../../../../services/phone-number.service';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';

@Component({
    selector: 'app-form-create-phone-number',
    templateUrl: './form-create-phone-number.component.html',
    styleUrls: ['./form-create-phone-number.component.scss'],
})
export class FormCreatePhoneNumberComponent extends FormCanDeactivate implements OnInit, OnDestroy {

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
    private _formData: IPhoneNumber = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';

    @Input() leftButtonText;

    @Output() onSubmitSuccess: EventEmitter<IPhoneNumber> = new EventEmitter<IPhoneNumber>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;

    phoneTypeOptions$: Observable<Array<IServerDropdownOption>>;
    phoneSourceOptions$: Observable<Array<IServerDropdownOption>>;
    @Input() set parentId(contactId: string) {
        this._parentId = contactId;
        if (this.form) {
            this.form.get('parentId').setValue(contactId);
        }
    }
    get parentId() {
        return this._parentId;
    }
    @Input() set formData(formData: IPhoneNumber) {
        this._formData = formData;
        if (this.form) {

            const formDataCopy = {...formData};
            formDataCopy.parentId = this.parentId;
            // delete form state already update above
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
        private phoneNumberService: PhoneNumberService,
        private cbLookupService: CouchbaseLookupService,
        private toasterService: ToasterService,
    ) {
        super();
        this.phoneTypeOptions$ = this.phoneNumberService.phoneTypeOptions();
        this.phoneSourceOptions$ = this.cbLookupService.getOptions(this.guids.EMAIL_PHONE_SOURCE);
    }

    ngOnInit() {
        this.initForm();
    }

    get formIsReadOnly() {
        return this.formOperation && this.formOperation === 'view';
    }

    get type() {
        return this.form.get('type');
    }

    get number() {
        return this.form.get('number');
    }

    get description() {
        return this.form.get('description');
    }

    get sms() {
        return this.form.get('sms');
    }

    get dflt() {
        return this.form.get('dflt');
    }

    initForm() {
        this.form = this.fb.group({
            id: [this.formData && this.formData.id],
            parentId: [this.parentId && this.parentId, Validators.required],
            type: [this.formData && this.formData.type, Validators.required],
            source: [this.formData && this.formData.source],
            number: [this.formData && this.formData.number, Validators.required],
            description: [this.formData && this.formData.description],
            sms: [this.formData && this.formData.sms],
            dflt: [this.formData && this.formData.dflt],
        });
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;

        let operation$: Observable<any>;
        operation$ = this.formOperation === 'update' ?
            this.phoneNumberService.update({phoneId: this.formData.id, formData}) :
            this.phoneNumberService.create(formData);

        operation$
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.submitted = false;
                        // update formData id with id returned by api if current operation is create
                        if (this.formOperation === 'create') {
                            formData.id = res.Data && res.Data.id || formData.id;
                        }
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
    closeDialog() {
        console.log('Will Close the dialog')
    }
}
