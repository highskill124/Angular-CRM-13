import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../../models/server-dropdown';
import {ContactsService} from '../../../../../services/contacts/contacts.service';
import {ToasterService} from 'angular2-toaster';
import {takeWhile} from 'rxjs/operators';
import {IContact} from '../../../../../models/contact';

@Component({
    selector: 'app-form-add-email-new-contact',
    templateUrl: './form-add-email-new-contact.component.html',
    styleUrls: ['./form-add-email-new-contact.component.scss']
})
export class FormAddEmailNewContactComponent implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    bucketOptions$: Observable<Array<IServerDropdownOption>>;

    alive = true;

    private _email = '';

    @Input() leftButtonText;

    @Output() onSubmitSuccess: EventEmitter<Partial<IContact>> = new EventEmitter<Partial<IContact>>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() set email(email: string) {
        this._email = email;
        if (this.form) {
            this.email_address.setValue(email);
        }
    }
    get email() {
        return this._email;
    }

    constructor(
        private fb: FormBuilder,
        private contactService: ContactsService,
        private toasterService: ToasterService,
    ) {
        this.bucketOptions$ = this.contactService.bucketList();
    }

    ngOnInit() {
        this.initForm();
    }

    get buckets() {
        return this.form.get('buckets') as FormArray;
    }

    get email_address() {
        return this.form.get('email_address');
    }

    initForm() {
        this.form = this.fb.group({
            first_name: [''],
            middle_name: [''],
            last_name: [''],
            phone: [''],
            email_address: [this.email, [Validators.required, Validators.email]],
            buckets: [[]], // initial value as empty array
        });
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;

        this.contactService.shortCreate(formData).pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.submitted = false;
                        this.onSubmitSuccess.emit(formData);
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
                    console.error('Failed to create contact ', error);
                },
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
