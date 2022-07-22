import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {FormOperation} from '../../../../models/form-operation';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {IEmail} from '../../../../models/email';
import {EmailService} from '../../../../services/email.service';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';

@Component({
    selector: 'app-form-create-email',
    templateUrl: './form-create-email.component.html',
    styleUrls: ['./form-create-email.component.scss'],
})
export class FormCreateEmailComponent extends FormCanDeactivate implements OnInit, OnDestroy {

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
    private _formData: IEmail = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';

    @Input() leftButtonText;

    @Output() onSubmitSuccess: EventEmitter<IEmail> = new EventEmitter<IEmail>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;

    emailTypeOptions$: Observable<Array<IServerDropdownOption>>;
    emailSourceOptions$: Observable<Array<IServerDropdownOption>>;
    @Input() set parentId(parentId: string) {
        this._parentId = parentId;
        if (this.form) {
            this.form.get('parentId').setValue(parentId);
        }
    }
    get parentId() {
        return this._parentId;
    }
    @Input() set formData(formData: IEmail) {
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
        private emailService: EmailService,
        private cbLookupService: CouchbaseLookupService,
        private toasterService: ToasterService,
    ) {
        super();
        this.emailTypeOptions$ = this.emailService.emailTypeOptions();
        this.emailSourceOptions$ = this.cbLookupService.getOptions(this.guids.EMAIL_PHONE_SOURCE);
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

    get address() {
        return this.form.get('address');
    }

    get name() {
        return this.form.get('name');
    }

    get otherLabel() {
        return this.form.get('otherLabel');
    }

    get dflt() {
        return this.form.get('dflt');
    }

    get source() {
        return this.form.get('source');
    }

    get dnmm() {
        return this.form.get('dnmm');
    }

    get bounce() {
        return this.form.get('bounce');
    }

    initForm() {
        console.log(this.formData),
        this.form = this.fb.group({

            id: [this.formData && this.formData.id],
            parentId: [this.parentId && this.parentId, Validators.required],
            type: [this.formData && this.formData.type, Validators.required],
            address: [this.formData && this.formData.address, Validators.required],
            name: [this.formData && this.formData.name],
            otherLabel: [this.formData && this.formData.otherLabel],
            dflt: [this.formData && this.formData.dflt],
            dnmm: [this.formData && this.formData.dnmm],
            bounce: [this.formData && this.formData.bounce],
            source: [this.formData && this.formData.source],
        });
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    markAsBad(DocId: string) {
        //
    }

    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;

        let operation$: Observable<any>;
        operation$ = this.formOperation === 'update' ?
            this.emailService.update({emailId: this.formData.id, formData}) :
            this.emailService.create(formData);

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
}
