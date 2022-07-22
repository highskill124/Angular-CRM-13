import { IEmail } from './../../../../models/email';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {combineLatest, Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {shareReplay, startWith, takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {IContactAddress, ILabeledAddressInput, ILabeledPhoneInput, IMainContact, IRecurringEventContact} from '../../../../models/contact';
import {CountryService} from '../../../../services/country.service';
import {IFollowUp} from '../../../../models/follow-up';
import {Router} from '@angular/router';
import {TagService} from '../../../../services/tag.service'
import {BucketService} from '../../../../services/bucket.service'
import {MatDialog} from '@angular/material/dialog';
import {EmailEditComponent} from '../../../emails/components/email-edit/email-edit.component'



@Component({
    selector: 'app-create-contact',
    templateUrl: './create-contact.component.html',
    styleUrls: ['./create-contact.component.scss'],
})
export class CreateContactComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    showEditNewButton = false;

    guids = DropdownGuids;
    tagOptions$: Observable<Array<IServerDropdownOption>>;
    countryOptions$: Observable<Array<IServerDropdownOption>>;
    followUpOptions$: Observable<Array<IServerDropdownOption>>;
    programOptions$: Observable<Array<IServerDropdownOption>>;
    bucketOptions$: Observable<Array<IServerDropdownOption>>;
    fileAsOptions$: Observable<IServerDropdownOption[]>;
    socialLabels$: Observable<IServerDropdownOption[]>;
    phoneLabels$: Observable<IServerDropdownOption[]>;
    emailLabels$: Observable<IServerDropdownOption[]>;
    websiteLabels$: Observable<IServerDropdownOption[]>;
    addressLabels$: Observable<IServerDropdownOption[]>;
    recurringEventLabels$: Observable<IServerDropdownOption[]>;

    @Input() formData: IMainContact;
    @Input() heading = 'Create Contact';

    alive = true;

    constructor(
        private fb: FormBuilder,
        private contactsService: ContactsService,
        private countryService: CountryService,
        private toasterService: ToasterService,
        private bucketService: BucketService,
        private tagService: TagService,
        private router: Router,
        private dialog: MatDialog,

    ) {
        super();
    }

    ngOnInit() {
        this.tagOptions$ = this.tagService.tagList('Contact').pipe(shareReplay());
        this.countryOptions$ = this.countryService.fetchAll().pipe(shareReplay());
        this.programOptions$ = this.contactsService.programsList(this.guids.PROGRAMS_CONTACT).pipe(shareReplay());
        this.followUpOptions$ = this.contactsService.followUpOptions(this.guids.FOLLOW_UP_METHODS).pipe(shareReplay());
        this.bucketOptions$ = this.bucketService.bucketList('Contact').pipe(shareReplay());
        this.socialLabels$ = this.contactsService.labelsList(this.guids.SOCIAL_LABELS).pipe(shareReplay());
        this.phoneLabels$ = this.contactsService.labelsList(this.guids.PHONE_LABELS).pipe(shareReplay());
        this.emailLabels$ = this.contactsService.labelsList(this.guids.EMAIL_LABELS).pipe(shareReplay());
        this.websiteLabels$ = this.contactsService.labelsList(this.guids.WEBSITE_LABELS).pipe(shareReplay());
        this.addressLabels$ = this.contactsService.labelsList(this.guids.ADDRESS_LABELS).pipe(shareReplay());
        this.recurringEventLabels$ = this.contactsService.labelsList(this.guids.RECURRING_EVENT_LABELS).pipe(shareReplay());

        this.initForm();
    }

    get follow_up() {
        return this.form.get('follow_up');
    }

    get add_to_outlook() {
        return this.form.get('add_to_outlook');
    }

    get tags() {
        return this.form.get('tags') as FormArray;
    }

    get buckets() {
        return this.form.get('buckets') as FormArray;
    }

    get addresses() {
        return this.form.get('addresses') as FormArray;
    }

    get recurring_events() {
        return this.form.get('recurring_events') as FormArray;
    }

    get follow_ups() {
        return this.form.get('follow_ups') as FormArray;
    }

    get socials() {
        return this.form.get('socials') as FormArray;
    }

    get websites() {
        return this.form.get('websites') as FormArray;
    }

    get emails() {
        return this.form.get('emails') as FormArray;
    }

    get phones() {
        return this.form.get('phones') as FormArray;
    }

    get initials() {
        return this.form.get('initials');
    }

    get first_name() {
        return this.form.get('first_name');
    }

    get last_name() {
        return this.form.get('last_name');
    }

    get company_name() {
        return this.form.get('company_name');
    }

    get start_date() {
        return this.form.get('start_date');
    }

    get end_date() {
        return this.form.get('end_date');
    }

    get state() {
        return this.form.get('state');
    }

    get city() {
        return this.form.get('city');
    }

    get postal_code() {
        return this.form.get('postal_code');
    }

    get street() {
        return this.form.get('street');
    }

    get dob() {
        return this.form.get('dob');
    }

    get status() {
        return this.form.get('status');
    }

    get currentOperation(): 'create' | 'update' {
        return this.formData && this.formData.DocId ? 'update' : 'create';
    }

    initForm() {
        const addresses = this.formData && this.formData.addresses
            ? this.formData.addresses.map(address => this.createAddress(address))
            : [this.createAddress()];

        const recurring_events = this.formData && this.formData.recurring_events
            ? this.formData.recurring_events.map(event => this.createRecurringEvent(event))
            : [this.createRecurringEvent()];

        const follow_ups = this.formData && this.formData.follow_ups
            ? this.formData.follow_ups.map(follow_up => this.createFollowUp(follow_up))
            : [this.createFollowUp()];

        const phones = this.formData && this.formData.phones
            ? this.formData.phones.map(phone => this.createLabeledPhoneInput(phone))
            : [this.createLabeledPhoneInput()];

        const buckets = this.formData && this.formData.buckets || [];

        const tags = this.formData && this.formData.tags || [];

        this.form = this.fb.group({
            first_name: [this.formData && this.formData.first_name],
            middle_name: [this.formData && this.formData.middle_name],
            last_name: [this.formData && this.formData.last_name],
            image: [this.formData && this.formData.image],
            dob: [this.formData && this.formData.dob],
            initials: [this.formData && this.formData.initials],
            spouse_name: [this.formData && this.formData.spouse_name],
            file_as: [this.formData && this.formData.file_as],
            company_name: [this.formData && this.formData.company_name],
            job_title: [this.formData && this.formData.job_title],
            phones: this.fb.array([...phones]),
            emails: this.fb.array([...this.labeledEmailInputsOrNew(this.formData && this.formData.emails)]),
            websites: this.fb.array([...this.labeledAddressInputsOrNew(this.formData && this.formData.websites)]),
            socials: this.fb.array([...this.labeledAddressInputsOrNew(this.formData && this.formData.socials)]),
            recurring_events: this.fb.array([...recurring_events]),
            addresses: this.fb.array([...addresses]),
            follow_ups: this.fb.array([...follow_ups]),
            notes: [this.formData && this.formData.notes],
            add_to_outlook: [this.formData && this.formData.add_to_outlook],
            tags: [[...tags]],
            buckets: [[...buckets]],
            programs: [this.formData && this.formData.programs],
        });
        this.setInitials();
        this.generateFileAsOptions();
    }

    createLabeledPhoneInput(data?: ILabeledPhoneInput): FormGroup {
        return this.fb.group({
            id: [data && data.id],
            type: [data && data.type],
            number: [data && data.number],
        });
    }

    labeledPhoneInputsOrNew(inputs: ILabeledPhoneInput[] = []): FormGroup[] {
        return inputs && inputs.length
            ? this.createLabeledPhoneInputs(inputs)
            : [this.createLabeledAddressInput()];
    }

    createLabeledPhoneInputs(inputs: ILabeledPhoneInput[]): FormGroup[] {
        return inputs.map(input => this.createLabeledPhoneInput(input));
    }

    createLabeledAddressInputs(inputs: ILabeledAddressInput[]): FormGroup[] {
        return inputs.map(input => this.createLabeledAddressInput(input));
    }

    labeledAddressInputsOrNew(inputs: ILabeledAddressInput[] = []): FormGroup[] {
        return inputs && inputs.length
            ? this.createLabeledAddressInputs(inputs)
            : [this.createLabeledAddressInput()];
    }

    createLabeledAddressInput(data?: ILabeledAddressInput) {
        return this.fb.group({
            id: [data && data.id],
            type: [data && data.type],
            address: [data && data.address],
        });
    }

    createLabeledEmailInputs(inputs: IEmail[]): FormGroup[] {
        return inputs.map(input => this.createLabeledEmailInput(input));
    }

    labeledEmailInputsOrNew(inputs: IEmail[] = []): FormGroup[] {
        return inputs && inputs.length
            ? this.createLabeledEmailInputs(inputs)
            : [this.createLabeledEmailInput()];
    }



    createLabeledEmailInput(data?: IEmail) {
        return this.fb.group({
            id: [data && data.id],
            type: [data && data.type],
            address: [data && data.address],
            name: [data && data.name],
            source: [data && data.source],
            dflt: [data && data.dflt],
            dnmm: [data && data.dnmm],
            bounce: [data && data.bounce],
            otherLabel: [data && data.otherLabel],
        });
    }
    createAddress(data?: IContactAddress) {
        return this.fb.group({
            id: [data && data.id],
            type: [data && data.type],
            street: [data && data.street],
            unit: [data && data.unit],
            city: [data && data.city],
            state: [data && data.state],
            postal_code: [data && data.postal_code],
            country: [data && data.country],
        });
    }

    createRecurringEvent(data?: IRecurringEventContact) {
        return this.fb.group({
            id: [data && data.id],
            type: [data && data.type],
            date: [data && data.date],
            description: [data && data.description],
        })
    }

    createFollowUp(data?: IFollowUp) {
        return this.fb.group({
            DocId: [data && data.DocId],
            start_date: [data && data.start_date],
            end_date: [data && data.end_date],
            notes: [data && data.notes],
            method: [data && data.method],
        })
    }

    onAddressGotten(addressObject: any, formGroup: FormGroup) {
        // console.info('Address ', addressObject);
        if (addressObject) {
            if (addressObject.admin_area_l1) {
                formGroup.get('state').setValue(addressObject.admin_area_l1);
            }
            if (addressObject.locality) {
                formGroup.get('city').setValue(addressObject.locality);
            }
            if (addressObject.country_short) {
                formGroup.get('country').setValue(addressObject.country_short);
            }
            if (addressObject.postal_code) {
                formGroup.get('postal_code').setValue(addressObject.postal_code);
            }
            formGroup.get('street').setValue(`${addressObject.street_number ? addressObject.street_number : ''} ${addressObject.route ? addressObject.route : ''}`)
        }
    }

    addFormArrayGroup(group: FormGroup, formArray: FormArray) {
        formArray.push(group);
    }

    setInitials() {
        combineLatest(
            this.first_name.valueChanges.pipe(
                startWith((this.formData && this.formData.first_name) || '')
            ),
            this.last_name.valueChanges.pipe(
                startWith((this.formData && this.formData.last_name) || '')
            ),
            (firstName, lastName) => {
                return `${firstName && firstName.length ? firstName.charAt(0).toUpperCase() : ''}${lastName && lastName.length ? lastName.charAt(0).toUpperCase() : ''}`;
            }
        ).pipe(
            takeWhile(() => this.alive)
        ).subscribe((initials) => {
            // check to see if there's at least one character of non whitespace
            if (/\S/.test(initials)) {
                this.initials.setValue(initials);
            } else {
                this.initials.setValue('');
            }
        });
    }

    generateFileAsOptions() {
        this.fileAsOptions$ = combineLatest(
            this.first_name.valueChanges.pipe(
                startWith((this.formData && this.formData.first_name) || '')
            ),
            this.last_name.valueChanges.pipe(
                startWith((this.formData && this.formData.last_name) || '')
            ),
            this.company_name.valueChanges.pipe(
                startWith((this.formData && this.formData.company_name) || '')
            ),
            (firstName, lastName, companyName) => {
                const options: IServerDropdownOption[] = [];
                if (firstName.length && lastName.length) {
                    // FirstName LastName
                    options.push({
                        name: `${firstName} ${lastName}`,
                        value: `${firstName} ${lastName}`,
                        selected: false,
                    });
                }
                if (firstName.length && lastName.length && companyName.length) {
                    // FirstName LastName (CompanyName)
                    options.push({
                        name: `${firstName} ${lastName} (${companyName})`,
                        value: `${firstName} ${lastName} (${companyName})`,
                        selected: false,
                    });
                    // (CompanyName) FirstName LastName
                    options.push({
                        name: `${companyName} (${firstName} ${lastName})`,
                        value: `${companyName} (${firstName} ${lastName})`,
                        selected: false,
                    });
                }
                if (companyName.length) {
                    // CompanyName
                    options.push({
                        name: `${companyName}`,
                        value: `${companyName}`,
                        selected: false,
                    });
                }
                return options;
            }
        );
    }

    onNew() {
        this.form.reset();
        this.form.enable();
        // hide the edit and new buttons
        this.showEditNewButton = false;
    }

    getDate(dateString: string) {
        return new Date(dateString);
    }

    setDob($event: Date) {
        this.dob.setValue($event.toLocaleDateString());
    }

    create(formData) {
        console.log(formData)
        this.errors = this.messages = [];
        this.submitted = true;

        const operation$ = this.currentOperation === 'update'
            ? this.contactsService.updateMain(this.formData.DocId, formData)
            : this.contactsService.createMain(formData);

        operation$.pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    // console.log(res);
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.submitted = false;

                        this.router.navigate(['/Contacts/ContactUpdate', res.DocId ? res.DocId : `${res.Data._id}:${res.Data._type}`]);
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

    removeFormArrayItem(index: number, formArray: FormArray) {
        if ((index >= 0) && this.hasTwoOrMoreItems(formArray)) {
            formArray.removeAt(index);
        }
    }

    onEdit() {
        this.router.navigate(['/Contacts/ContactUpdate', this.formData.DocId]);
    }

    confirmSubmit($event) {
        if (!confirm('Submit contact?')) {
            $event.preventDefault();
        }
    }

    hasTwoOrMoreItems(formArray: FormArray) {
        return formArray && formArray.length > 1;
    }

    editEmail(index: number, formArray: FormArray ) {
        console.log(index)
        console.log(formArray.value[index])



            const dialogRef = this.dialog.open(EmailEditComponent,
                {
                    data: {DocId: formArray.value[index].id, Data: formArray.value[index], ParentId: this.formData.DocId, mode: 'edit'},
                    disableClose: false, width: '650px', position: {
                        top: '50px'
                    },
                    panelClass:'no-pad-dialog',
                })
            dialogRef.afterClosed().subscribe( ta => { console.log(ta)
                    // TODOD: Need to check if the data has changed, if so call this.getEmails() and refresh the emails Array
                    // nEED TO UPDATE fORM ARRAY Index with Values pased back with data in ta.data

                    this.emails.at(index).patchValue( {
                        id: ta.data.id,
                        type: ta.data.type,
                        address:  ta.data.address,
                        name: ta.data.name,
                        source: ta.data.source,
                        dflt: ta.data.dflt,
                        dnmm: ta.data.dnmm,
                        bounce: ta.data.bounce,
                        otherLabel: ta.data.otherLabel
        });

                }
            );
        }

        addEmail() {
                const dialogRef = this.dialog.open(EmailEditComponent,
                    {
                        data: {ParentId: this.formData.DocId, mode: 'new'},
                        disableClose: false, width: '600px', position: {
                            top: '50px'
                        },
                    })
                dialogRef.afterClosed().subscribe(
                    ta => {
                        console.log(ta)
                        console.log(ta.reload)
                        if (ta.reload === true) {
                                    console.log('we will create new email' )
                                    this.addFormArrayGroup(this.createLabeledEmailInput(ta.data), this.emails)
                                } else {
                                    console.log('No need to relaod')
                                }
                            });
            }

        getEmails() {
            this.contactsService.getEmails(this.formData.DocId ).subscribe(
                res =>  { console.log(res)
         })

        }

}
