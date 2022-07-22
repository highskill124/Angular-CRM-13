import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {map, shareReplay, takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {Observable} from 'rxjs';
import {IContactAddConnection} from '../../../../models/contact';
import {IContactConnection} from '../../../../models/contact-connection';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {ContactConnectionService} from '../../../../services/contact-connection.service';

@Component({
    selector: 'app-form-create-connection',
    templateUrl: './form-create-connection.component.html',
    styleUrls: ['./form-create-connection.component.scss'],
})
export class FormCreateConnectionComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    private _contact: IContactAddConnection;

    @Input() leftButtonText;

    selectedContact: IServerDropdownOption;
    contacts$: Observable<IServerDropdownOption[]>;
    relationshipTypes$: Observable<IServerDropdownOption[]>;

    @Output() onSubmitSuccess: EventEmitter<IContactConnection> = new EventEmitter<IContactConnection>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;
    @Input() set contact(contact: IContactAddConnection) {
        this._contact = contact;
        if (this.form) {
            this.form.get('parentid').setValue(contact.DocId);
        }
    }
    get contact() {
        return this._contact;
    }

    constructor(
        private fb: FormBuilder,
        private connectionService: ContactConnectionService,
        private contactService: ContactsService,
        private toasterService: ToasterService,
    ) {
        super();
    }

    ngOnInit() {
        this.relationshipTypes$ = this.connectionService.relationshipTypes().pipe(shareReplay());
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            parentid: [this.contact && this.contact.DocId, Validators.required],
            childid: ['', Validators.required],
            relationship: ['', Validators.required],
        });
    }

    get childid() {
        return this.form.get('childid');
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;

        this.connectionService.create(formData).pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    console.log('result here ', res);
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
                },
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }

    setContacts(searchValue) {
        this.contacts$ = this.contactService.nameLookup(searchValue).pipe(
            map(contacts => {
                if (this.contact) {
                    // filter out the current contact
                    return contacts.filter(contact => contact.value !== this.contact.DocId);
                } else {
                    return contacts;
                }
            }),
        );
    }

    setSelectedContact(contact: IServerDropdownOption) {
        this.selectedContact = contact;
    }
}
