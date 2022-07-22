import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {combineLatest, Observable} from 'rxjs';
import {IServerDropdownOption, ServerDropdownOption} from '../../../../models/server-dropdown';
import {map, startWith, takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {IgxChipsAreaComponent} from 'igniteui-angular';
import {IOptionMultiSelectBox} from '../../../../modules/multi-select-box/components/multi-select-box/multi-select-box.component';
import {TagService} from '../../../../services/tag.service'
import {BucketService} from '../../../../services/bucket.service'

@Component({
    selector: 'app-quick-contact-form',
    templateUrl: './quick-contact-form.component.html',
    styleUrls: ['./quick-contact-form.component.css'],
})
export class QuickContactFormComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    showEditNewButton = false;
    DocId: string = null;

    guids = DropdownGuids;
    tagOptions$: Observable<Array<ServerDropdownOption>>;
    bucketOptions$: Observable<Array<ServerDropdownOption>>;
    fileAsOptions$: Observable<ServerDropdownOption[]>;

    @ViewChild('tagChipsArea', {read: IgxChipsAreaComponent})
    public tagChipsArea: IgxChipsAreaComponent;

    @ViewChild('bucketChipsArea', {read: IgxChipsAreaComponent})
    public bucketChipsArea: IgxChipsAreaComponent;

    @Output() edit = new EventEmitter<{ DocId: string }>();

    alive = true;

    constructor(
        private fb: FormBuilder,
        private contactsService: ContactsService,
        private toasterService: ToasterService,
        private bucketService: BucketService,
        private tagService: TagService
    ) {
        super();
    }

    ngOnInit() {
        this.tagOptions$ = this.tagService.tagList('Contact');
        this.bucketOptions$ = this.bucketService.bucketList('Contact');

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

    initForm() {
        this.form = this.fb.group({
            first_name: [],
            middle_name: [],
            last_name: [],
            dob: [],
            initials: [],
            spouse_name: [],
            file_as: [],
            company_name: [],
            job_title: [],
            home_phone: [],
            cell_phone: [],
            office_phone: [],
            fax_number: [],
            email_address: [],
            email_alternate: [],
            street: [],
            city: [],
            state: [],
            postal_code: [],
            notes: [],
            follow_up: [],
            start_date: [],
            end_date: [],
            add_to_outlook: [],
            tags: this.fb.array([
                // this.fb.control(''),
            ]),
            buckets: this.fb.array([]),
        });
        this.setInitials();
        this.generateFileAsOptions();
    }

    onAddressGotten(addressObject) {
        console.log('Address ', addressObject);
        if (addressObject) {
            if (addressObject.admin_area_l1) {
                this.state.setValue(addressObject.admin_area_l1);
            }
            if (addressObject.locality) {
                this.city.setValue(addressObject.locality);
            }
            if (addressObject.postal_code) {
                this.postal_code.setValue(addressObject.postal_code);
            }
            this.street.setValue(`${addressObject.street_number ? addressObject.street_number : ''} ${addressObject.route ? addressObject.route : ''}`)
        }
    }

    addFormArrayControl(controlValue, formArray: FormArray, chipsArea?: IgxChipsAreaComponent) {
        formArray.push(this.fb.control(controlValue));
        if (chipsArea) {
            chipsArea.cdr.detectChanges();
        }
    }

    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    syncFormArray(options: IOptionMultiSelectBox[], formArray: FormArray) {
        this.clearFormArray(formArray);
        options.forEach(option => {
            // console.log('syncing in contact ', option.isSelected, option.name);
            // const formHasOption = formArray.value.findIndex(item => item === option.value) !== -1;
            if (option.selected) {
                this.addFormArrayControl(option.value, formArray);
            } /*else if (!option.selected && formHasOption) {
              this.removeFormArrayControl(option.value, formArray);
          }*/
        });
    }

    tagDetails(tagId: string | number, tagOptions: ServerDropdownOption[]) {
        return tagOptions.find(option => option.value === tagId);
    }

    removeFormArrayControl(controlValue, formArray: FormArray, chipsArea?: IgxChipsAreaComponent, optionsToUpdate?: IServerDropdownOption[]) {
        formArray.removeAt(
            formArray.value.findIndex(item => item === controlValue)
        );
        if (chipsArea) {
            chipsArea.cdr.detectChanges();
        }
        if (optionsToUpdate && optionsToUpdate.length) {
            optionsToUpdate = optionsToUpdate.map(option => {
                option.selected = option.value === controlValue ? false : option.selected;
                return option;
            });
        }
    }

    setInitials() {
        combineLatest([
            this.first_name.valueChanges.pipe(startWith('')),
            this.last_name.valueChanges.pipe(startWith('')),
        ]).pipe(
            takeWhile(() => this.alive),
            map(([firstName, lastName]) => {
                return `${firstName && firstName.length ? firstName.charAt(0).toUpperCase() : ''}${lastName && lastName.length ? lastName.charAt(0).toUpperCase() : ''}`;
            })
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
            this.first_name.valueChanges.pipe(startWith('')),
            this.last_name.valueChanges.pipe(startWith('')),
            this.company_name.valueChanges.pipe(startWith('')),
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

    onEdit() {
        this.edit.emit({DocId: this.DocId});
    }

    onNew() {
        this.clearFormArray(this.tags);
        this.clearFormArray(this.buckets);
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
        this.errors = this.messages = [];
        this.submitted = true;

        this.contactsService.quickCreate(formData).pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    // console.log(res);
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.submitted = false;
                        this.DocId = res.Data.DocId;
                        // disable form
                        this.form.disable();
                        // show edit contact and create new contact buttons
                        this.showEditNewButton = true;
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
