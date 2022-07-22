import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {combineLatest} from 'rxjs';
import 'rxjs-compat/add/operator/startWith';
import {startWith, takeWhile} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster';
import {phoneNumberValidator} from '../../../../shared/directives/phone-number-validator.directive';
import {AsYouType, CountryCode, parsePhoneNumber} from 'libphonenumber-js';
import {LeadForm} from '../../lead';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import Titles from '../../../../models/titles';

@Component({
    selector: 'app-create-lead',
    templateUrl: './create-lead.component.html',
    styleUrls: ['./create-lead.component.css']
})
export class CreateLeadComponent implements OnInit, OnDestroy {

    @Input() formData: LeadForm = new LeadForm({});
    @Input() submitText = 'Submit';
    @Input() heading = 'New Lead';
    @Input() submitEndpoint = '/leads/new';
    @Input() requestMethod = 'post';
    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    countryCode: CountryCode = 'US';

    primaryContactAccordionOpened = true;
    secondaryContactAccordionOpened = true;

    alive = true;

    guids = DropdownGuids;
    suffixes = [
        {
            name: 'I',
            value: 'I',
        },
        {
            name: 'II',
            value: 'II',
        },
        {
            name: 'III',
            value: 'III',
        },
        {
            name: 'Jr.',
            value: 'Jr.',
        },
        {
            name: 'Sr.',
            value: 'Sr.',
        }
    ];
    titles = Titles;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private toasterService: ToasterService,
    ) {
    }

    ngOnInit() {
        this.initForm();

        this.setContactNames(true);

    }

    // so we can easily access individual form controls under each FormGroup in the html element
    get primaryContact() {
        return this.form.get('primaryContact');
    };

    get p_contact_name() {
        return this.primaryContact.get('p_contact_name');
    }

    get p_contact_first_name() {
        return this.primaryContact.get('p_contact_first_name');
    }

    get p_contact_middle_name() {
        return this.primaryContact.get('p_contact_middle_name');
    }

    get p_contact_last_name() {
        return this.primaryContact.get('p_contact_last_name');
    }

    get p_contact_title() {
        return this.primaryContact.get('p_contact_title');
    }

    get p_contact_suffix() {
        return this.primaryContact.get('p_contact_suffix');
    }

    get p_contact_gender() {
        return this.primaryContact.get('p_contact_gender');
    }

    get primaryContactInfo() {
        return this.form.get('primaryContactInfo');
    };

    get p_contact_bday() {
        return this.primaryContactInfo.get('p_contact_bday');
    }

    get p_contact_mobile() {
        return this.primaryContactInfo.get('p_contact_mobile');
    }

    get p_contact_home() {
        return this.primaryContactInfo.get('p_contact_home');
    }

    get p_contact_office() {
        return this.primaryContactInfo.get('p_contact_office');
    }

    get p_contact_email() {
        return this.primaryContactInfo.get('p_contact_email');
    }

    get p_contact_email_alternate() {
        return this.primaryContactInfo.get('p_contact_email_alternate');
    }

    get p_contact_job_title() {
        return this.primaryContactInfo.get('p_contact_job_title');
    }

    get p_contact_occupation() {
        return this.primaryContactInfo.get('p_contact_occupation');
    }


    get secondaryContact() {
        return this.form.get('secondaryContact');
    }

    get s_contact_name() {
        return this.secondaryContact.get('s_contact_name');
    }

    get s_contact_first_name() {
        return this.secondaryContact.get('s_contact_first_name');
    }

    get s_contact_middle_name() {
        return this.secondaryContact.get('s_contact_middle_name');
    }

    get s_contact_last_name() {
        return this.secondaryContact.get('s_contact_last_name');
    }

    get s_contact_title() {
        return this.secondaryContact.get('s_contact_title');
    }

    get s_contact_suffix() {
        return this.secondaryContact.get('s_contact_suffix');
    }

    get s_contact_gender() {
        return this.secondaryContact.get('s_contact_gender');
    }

    get secondaryContactInfo() {
        return this.form.get('secondaryContactInfo');
    };

    get s_contact_bday() {
        return this.secondaryContactInfo.get('s_contact_bday');
    }

    get s_contact_mobile() {
        return this.secondaryContactInfo.get('s_contact_mobile');
    }

    get s_contact_home() {
        return this.secondaryContactInfo.get('s_contact_home');
    }

    get s_contact_office() {
        return this.secondaryContactInfo.get('s_contact_office');
    }

    get s_contact_email() {
        return this.secondaryContactInfo.get('s_contact_email');
    }

    get s_contact_email_alternate() {
        return this.secondaryContactInfo.get('s_contact_email_alternate');
    }

    get s_contact_job_title() {
        return this.secondaryContactInfo.get('s_contact_job_title');
    }

    get s_contact_occupation() {
        return this.secondaryContactInfo.get('s_contact_occupation');
    }

    get address() {
        return this.form.get('address');
    };

    get home_street_address() {
        return this.address.get('home_street_address');
    }

    get home_city() {
        return this.address.get('home_city');
    }

    get home_state() {
        return this.address.get('home_state');
    }

    get home_zip() {
        return this.address.get('home_zip');
    }

    get home_country() {
        return this.address.get('home_country');
    }

    get searchInfo() {
        return this.form.get('searchInfo');
    };

    get search_min_beds() {
        return this.searchInfo.get('search_min_beds');
    }

    get search_min_baths() {
        return this.searchInfo.get('search_min_baths');
    }

    get search_min_garage() {
        return this.searchInfo.get('search_min_garage');
    }

    get search_pool() {
        return this.searchInfo.get('search_pool');
    }

    get search_min_sq_ft() {
        return this.searchInfo.get('search_min_sq_ft');
    }

    get search_storey() {
        return this.searchInfo.get('search_storey');
    }

    get search_max_sqft() {
        return this.searchInfo.get('search_max_sqft');
    }

    get search_min_lot_sqft() {
        return this.searchInfo.get('search_min_lot_sqft');
    }

    get search_max_lot_sqft() {
        return this.searchInfo.get('search_max_lot_sqft');
    }

    get search_min_year_build() {
        return this.searchInfo.get('search_min_year_build');
    }

    get search_max_year_build() {
        return this.searchInfo.get('search_max_year_build');
    }


    setContactNames(setFromInput = false) {
        combineLatest(
            this.primaryContact.get('p_contact_title').valueChanges.pipe(startWith('')),
            this.primaryContact.get('p_contact_first_name').valueChanges.pipe(startWith('')),
            this.primaryContact.get('p_contact_middle_name').valueChanges.pipe(startWith('')),
            this.primaryContact.get('p_contact_last_name').valueChanges.pipe(startWith('')),
            this.primaryContact.get('p_contact_suffix').valueChanges.pipe(startWith('')),
            (title, firstName, middleName, lastName, suffix) => {
                return `${title} ${firstName} ${middleName} ${lastName} ${suffix}`;
            }
        ).pipe(
            takeWhile(() => this.alive)
        ).subscribe((fullName) => {
            // check to see if there's at least one character of non whitespace
            if (/\S/.test(fullName)) {
                this.primaryContact.get('p_contact_name').setValue(fullName);
            } else {
                this.primaryContact.get('p_contact_name').setValue('');
            }
        });

        combineLatest(
            this.secondaryContact.get('s_contact_title').valueChanges.pipe(startWith('')),
            this.secondaryContact.get('s_contact_first_name').valueChanges.pipe(startWith('')),
            this.secondaryContact.get('s_contact_middle_name').valueChanges.pipe(startWith('')),
            this.secondaryContact.get('s_contact_last_name').valueChanges.pipe(startWith('')),
            this.secondaryContact.get('s_contact_suffix').valueChanges.pipe(startWith('')),
            (title, firstName, middleName, lastName, suffix) => {
                return `${title} ${firstName} ${middleName} ${lastName} ${suffix}`;
            }
        ).pipe(
            takeWhile(() => this.alive)
        ).subscribe((fullName) => {
            if (/\S/.test(fullName)) {
                this.secondaryContact.get('s_contact_name').setValue(fullName);
            } else {
                this.secondaryContact.get('s_contact_name').setValue('');
            }
        });

        if (setFromInput && this.formData) {
            this.primaryContact.get('p_contact_title').setValue(this.formData.p_contact_title);
            this.primaryContact.get('p_contact_first_name').setValue(this.formData.p_contact_first_name);
            this.primaryContact.get('p_contact_middle_name').setValue(this.formData.p_contact_middle_name);
            this.primaryContact.get('p_contact_last_name').setValue(this.formData.p_contact_last_name);
            this.primaryContact.get('p_contact_suffix').setValue(this.formData.p_contact_suffix);

            this.secondaryContact.get('s_contact_title').setValue(this.formData.s_contact_title);
            this.secondaryContact.get('s_contact_first_name').setValue(this.formData.s_contact_first_name);
            this.secondaryContact.get('s_contact_middle_name').setValue(this.formData.s_contact_middle_name);
            this.secondaryContact.get('s_contact_last_name').setValue(this.formData.s_contact_last_name);
            this.secondaryContact.get('s_contact_suffix').setValue(this.formData.s_contact_suffix);
        }
    }

    initForm() {
        this.form = this.fb.group({
            primaryContact: this.fb.group({
                p_contact_name: [this.formData.p_contact_name],
                p_contact_first_name: [this.formData.p_contact_first_name],
                p_contact_middle_name: [this.formData.p_contact_middle_name],
                p_contact_last_name: [this.formData.p_contact_last_name],
                p_contact_title: [this.formData.p_contact_title],
                p_contact_suffix: [this.formData.p_contact_suffix],
                p_contact_gender: [this.formData.p_contact_gender],
            }),
            primaryContactInfo: this.fb.group({
                p_contact_bday: [this.formData.p_contact_bday],
                p_contact_mobile: [
                    new AsYouType(this.countryCode).input(this.formData.p_contact_mobile),
                    phoneNumberValidator(this.countryCode),
                ],
                p_contact_home: [
                    new AsYouType(this.countryCode).input(this.formData.p_contact_home),
                    phoneNumberValidator(this.countryCode),
                ],
                p_contact_office: [
                    new AsYouType(this.countryCode).input(this.formData.p_contact_office),
                    phoneNumberValidator(this.countryCode),
                ],
                p_contact_email: [this.formData.p_contact_email, Validators.email],
                p_contact_email_alternate: [this.formData.p_contact_email_alternate, Validators.email],
                p_contact_job_title: [this.formData.p_contact_title],
                p_contact_occupation: [this.formData.p_contact_occupation],
            }),
            secondaryContact: this.fb.group({
                s_contact_name: [this.formData.s_contact_name],
                s_contact_first_name: [this.formData.s_contact_first_name],
                s_contact_middle_name: [this.formData.s_contact_middle_name],
                s_contact_last_name: [this.formData.s_contact_last_name],
                s_contact_title: [this.formData.s_contact_title],
                s_contact_suffix: [this.formData.s_contact_suffix],
                s_contact_gender: [this.formData.s_contact_gender],
            }),
            secondaryContactInfo: this.fb.group({
                s_contact_bday: [this.formData.s_contact_bday],
                s_contact_mobile: [
                    new AsYouType(this.countryCode).input(this.formData.s_contact_mobile),
                    phoneNumberValidator(this.countryCode),
                ],
                s_contact_home: [
                    new AsYouType(this.countryCode).input(this.formData.s_contact_home),
                    phoneNumberValidator(this.countryCode),
                ],
                s_contact_office: [
                    new AsYouType(this.countryCode).input(this.formData.s_contact_office),
                    phoneNumberValidator(this.countryCode),
                ],
                s_contact_email: [this.formData.s_contact_email, Validators.email],
                s_contact_email_alternate: [this.formData.s_contact_email_alternate, Validators.email],
                s_contact_job_title: [this.formData.s_contact_job_title],
                s_contact_occupation: [this.formData.s_contact_occupation],
            }),
            address: this.fb.group({
                home_street_address: [this.formData.home_street_address],
                home_city: [this.formData.home_city],
                home_state: [this.formData.home_state],
                home_zip: [this.formData.home_zip],
                home_country: [this.formData.home_country],
            }),
            searchInfo: this.fb.group({
                search_min_beds: [this.formData.search_min_beds],
                search_min_baths: [this.formData.search_min_baths],
                search_min_garage: [this.formData.search_min_garage],
                search_pool: [this.formData.search_pool],
                search_min_sq_ft: [this.formData.search_min_sq_ft],
                search_storey: [this.formData.search_storey],
                search_max_sqft: [this.formData.search_max_sqft],
                search_min_lot_sqft: [this.formData.search_min_lot_sqft],
                search_max_lot_sqft: [this.formData.search_max_lot_sqft],
                search_min_year_build: [this.formData.search_min_year_build],
                search_max_year_build: [this.formData.search_max_year_build],
            }),
        });
    }

    today() {
        return new Date();
    }

    // all fields in the form are are under a child formgroup so parentName is always sent
    updateControl($event, controls: { parentName: string, controlName: string }) {
        // console.log(parseNumber(`${$event}`, this.countryCode));
        if (controls.parentName) {
            this.form.get(controls.parentName).get(controls.controlName).setValue($event);
        } /*else if (!controls.parentName && controls.controlName) {
      this.form.get(controls.parentName).get(controls.controlName).patchValue($event);
    }*/
    }

    create(formData) {
        console.log(formData);
        this.errors = this.messages = [];
        this.submitted = true;

        const payload = this.getFlatJson(formData);
        this.http.request(
            this.requestMethod,
            `${environment.socketUrl}${this.submitEndpoint}`,
            {body: payload},
        ).subscribe((res: any) => {
                this.submitted = false;
                console.log(res);
                if (res) {
                    console.log(res.LeadID);
                    this.toasterService.pop('success', 'Success!', res.Message);

                    // switch to updating
                    this.submitText = 'Update';
                    this.heading = 'Update Lead';
                    this.submitEndpoint = `/leads/update/${res.LeadID}`;
                    this.requestMethod = 'put';
                } else {
                    this.showMessages.error = true;
                    this.toasterService.pop('error', res.Message);
                    this.errors = [res.Message];
                }
            },
            (error) => {
                this.submitted = false;
                this.toasterService.pop('error', 'Something went wrong!', 'Please try again.');
                console.error('Failed to register lead ', error);
            },
        );
    }

    getFlatJson(formData) {
        return {
            p_contact_name: formData.primaryContact.p_contact_name,
            p_contact_first_name: formData.primaryContact.p_contact_first_name,
            p_contact_middle_name: formData.primaryContact.p_contact_middle_name,
            p_contact_last_name: formData.primaryContact.p_contact_last_name,
            p_contact_title: formData.primaryContact.p_contact_title,
            p_contact_suffix: formData.primaryContact.p_contact_suffix,
            p_contact_gender: formData.primaryContact.p_contact_gender,

            p_contact_bday: formData.primaryContactInfo.p_contact_bday,
            p_contact_mobile: parsePhoneNumber(formData.primaryContactInfo.p_contact_mobile, this.countryCode).nationalNumber,
            p_contact_home: parsePhoneNumber(formData.primaryContactInfo.p_contact_home, this.countryCode).nationalNumber,
            p_contact_office: parsePhoneNumber(formData.primaryContactInfo.p_contact_office, this.countryCode).nationalNumber,
            p_contact_email: formData.primaryContactInfo.p_contact_email,
            p_contact_email_alternate: formData.primaryContactInfo.p_contact_email_alternate,
            p_contact_job_title: formData.primaryContactInfo.p_contact_job_title,
            p_contact_occupation: formData.primaryContactInfo.p_contact_occupation,
            s_contact_name: formData.secondaryContact.s_contact_name,
            s_contact_first_name: formData.secondaryContact.s_contact_first_name,
            s_contact_middle_name: formData.secondaryContact.s_contact_middle_name,
            s_contact_last_name: formData.secondaryContact.s_contact_last_name,
            s_contact_title: formData.secondaryContact.s_contact_title,
            s_contact_suffix: formData.secondaryContact.s_contact_suffix,
            s_contact_gender: formData.secondaryContact.s_contact_gender,

            s_contact_bday: formData.secondaryContactInfo.s_contact_bday,
            s_contact_mobile: parsePhoneNumber(formData.secondaryContactInfo.s_contact_mobile, this.countryCode).nationalNumber,
            s_contact_home: parsePhoneNumber(formData.secondaryContactInfo.s_contact_home, this.countryCode).nationalNumber,
            s_contact_office: parsePhoneNumber(formData.secondaryContactInfo.s_contact_office, this.countryCode).nationalNumber,
            s_contact_email: formData.secondaryContactInfo.s_contact_email,
            s_contact_email_alternate: formData.secondaryContactInfo.s_contact_email_alternate,
            s_contact_job_title: formData.secondaryContactInfo.s_contact_job_title,
            s_contact_occupation: formData.secondaryContactInfo.s_contact_occupation,

            home_street_address: formData.address.home_street_address,
            home_city: formData.address.home_city,
            home_state: formData.address.home_state,
            home_zip: formData.address.home_zip,
            home_country: formData.address.home_country,

            search_min_beds: formData.searchInfo.search_min_beds,
            search_min_baths: formData.searchInfo.search_min_baths,
            search_min_garage: formData.searchInfo.search_min_garage,
            search_pool: formData.searchInfo.search_pool,
            search_min_sq_ft: formData.searchInfo.search_min_sq_ft,
            search_storey: formData.searchInfo.search_storey,
            search_max_sqft: formData.searchInfo.search_max_sqft,
            search_min_lot_sqft: formData.searchInfo.search_min_lot_sqft,
            search_max_lot_sqft: formData.searchInfo.search_max_lot_sqft,
            search_min_year_build: formData.searchInfo.search_min_year_build,
            search_max_year_build: formData.searchInfo.search_max_year_build,

        };
    }

    updateHeadingPrimaryContact($event) {
        this.primaryContactAccordionOpened = $event;
    }

    updateHeadingSecondaryContact($event) {
        this.secondaryContactAccordionOpened = $event;
    }

    primaryContactAccordionHeading() {

        if (this.primaryContactAccordionOpened) {
            return 'Primary contact';
        } else {
            let headingPrimary = '';
            if (this.p_contact_name.value) {
                headingPrimary += this.p_contact_name.value;
            }
            if (this.p_contact_mobile.value) {
                headingPrimary += ' | ' + this.p_contact_mobile.value;
            }
            if (this.p_contact_email.value) {
                headingPrimary += ' | ' + this.p_contact_email.value;
            }
            // console.log(headingPrimary);
            return headingPrimary ? headingPrimary : 'Primary contact';
        }
    }

    secondaryContactAccordionHeading() {

        if (this.secondaryContactAccordionOpened) {
            return 'Secondary contact';
        } else {
            let headingSecondary = '';
            if (this.p_contact_name.value) {
                headingSecondary += this.s_contact_name.value;
            }
            if (this.p_contact_mobile.value) {
                headingSecondary += ' | ' + this.s_contact_mobile.value;
            }
            if (this.p_contact_email.value) {
                headingSecondary += ' | ' + this.s_contact_email.value;
            }
            // console.log(headingPrimary);
            return headingSecondary ? headingSecondary : 'Secondary contact';
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

}
