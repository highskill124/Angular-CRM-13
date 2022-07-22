import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {IContact} from '../../../../../models/contact';
import {ContactsService} from '../../../../../services/contacts/contacts.service';
import {ServerDropdownOption} from '../../../../../models/server-dropdown';
import {takeWhile} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-form-add-email-existing-contact',
    templateUrl: './form-add-email-existing-contact.component.html',
    styleUrls: ['./form-add-email-existing-contact.component.scss'],
})
export class FormAddEmailExistingContactComponent implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    contacts$: Observable<Array<ServerDropdownOption>>;

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
    }

    ngOnInit() {
        this.initForm();
    }

    get DocId() {
        return this.form.get('DocId');
    }

    get email_address() {
        return this.form.get('email_address');
    }

    initForm() {
        this.form = this.fb.group({
            DocId: ['', [Validators.required]],
            email_address: [this.email, [Validators.required, Validators.email]],
        });
    }

    setContacts(searchValue) {
        this.contacts$ = this.contactService.nameLookup(searchValue);
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;

        this.contactService.emailAdd({address: formData.email_address}, formData.DocId)
            .pipe(
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
