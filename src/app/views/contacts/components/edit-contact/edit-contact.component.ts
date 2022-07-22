import {AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Location} from '@angular/common';
import {mergeMap, takeWhile} from 'rxjs/operators';
import {ComponentCanDeactivate} from '../../../../guards/can-deactivate/component-can-deactivate';
import {FormGroup} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {IMainContact} from '../../../../models/contact';
import {CreateContactComponent} from '../create-contact/create-contact.component';
import {ContactsService} from '../../../../services/contacts/contacts.service';

@Component({
    selector: 'app-edit-contact',
    templateUrl: './edit-contact.component.html',
    styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent extends ComponentCanDeactivate implements OnInit, OnDestroy, AfterViewInit {

    formData: IMainContact;
    editForm: FormGroup;
    submitText = 'Update';
    heading: string;

    alive = true;

    @ViewChildren(CreateContactComponent) createContacts: QueryList<CreateContactComponent>;

    constructor(
        private http: HttpClient,
        protected route: ActivatedRoute,
        private contactsService: ContactsService,
        private location: Location,
        private toasterService: ToasterService,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {
        this.route.params
            .pipe(
                takeWhile(_ => this.alive),
                mergeMap((params: Params) => {
                    return this.contactsService.fetch(params.DocId);
                }),
            ).subscribe((res: any) => {
            this.formData = res.Data;
            console.log(this.formData);
            this.heading = `Update Contact - ${this.formData.first_name || ''} ${this.formData.middle_name || ''} ${this.formData.last_name || ''}`;
        });
    }

    ngAfterViewInit() {
        this.createContacts.changes
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((forms: QueryList<CreateContactComponent>) => {
                this.editForm = forms.first.form;
            });
    }

    goBack() {
        this.location.back();
    }

    deleteContact(DocId) {
        this.contactsService.delete(DocId)
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((res: any) => {
                if (res.Success === true) {
                    this.toasterService.pop('success', 'Success!', res.Message);
                    this.router.navigateByUrl('/Contacts/ContactList');
                }
            });
    }

    ngOnDestroy() {
        this.alive = false;
    }

    canDeactivate(): boolean {
        if (this.editForm) {
            return !this.editForm.dirty;
        }
        return true;
    }

}
