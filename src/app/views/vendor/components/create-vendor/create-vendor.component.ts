import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs-compat/add/operator/startWith';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster';
import {takeWhile} from 'rxjs/operators';
import {INote, ITag, Vendor} from '../vendor.model';
import Titles from '../../../../models/titles';

@Component({
    selector: 'app-create-vendor',
    templateUrl: './create-vendor.component.html',
    styleUrls: ['./create-vendor.component.css']
})
export class CreateVendorComponent implements OnInit, OnDestroy {

    @Input() formData: Vendor = new Vendor({});
    @Input() submitText = 'Save';
    @Input() heading = 'New Vendor';
    @Input() submitEndpoint = '/vendor/new';
    @Input() requestMethod = 'post';
    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    titles = Titles;

    alive = true;

    get status() {
        return this.form.get('status');
    }

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private toasterService: ToasterService,
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.trackValuesChanged();
    }

    get preferred() {
        return this.form.get('preferred');
    }

    get share() {
        return this.form.get('share');
    }

    get tags() {
        return this.form.get('tags') as FormArray;
    }

    get notes() {
        return this.form.get('notes') as FormArray;
    }

    addTag(tag: ITag) {
        this.tags.push(this.fb.control(tag.name));
    }

    addNote(note?: INote) {
        this.notes.push(
            this.fb.group({
                type: [note ? note.type : ''],
                subject: [note ? note.subject : ''],
                created_on: [note ? note.created_on : ''],
                created_by: [note ? note.created_by : ''],
                private: [note ? note.private === 1 : false],
                notes: [note ? note.notes : ''],
                format: [note ? note.format : ''],
            })
        );
    }

    initForm() {
        this.form = this.fb.group({
            company_name: [this.formData.company_name],
            dba: [this.formData.dba],
            address: [this.formData.address],
            city: [this.formData.city, [/*Validators.required*/]],
            state: [this.formData.state],
            zip: [this.formData.zip],
            licnbr: [this.formData.licnbr],
            email: [this.formData.email, [Validators.email]],
            website: [this.formData.website],
            preferred: [this.formData.prefered === 1],
            share: [this.formData.share === 1],
            contacts: this.fb.group({
                p_name: [this.formData.contacts.p_name],
                p_title: [this.formData.contacts.p_title],
                p_phone: [this.formData.contacts.p_phone],
                p_mobile: [this.formData.contacts.p_mobile],
                p_email: [this.formData.contacts.p_email, [Validators.email]],
                s_name: [this.formData.contacts.s_name],
                s_title: [this.formData.contacts.s_title],
                s_phone: [this.formData.contacts.s_phone],
                s_mobile: [this.formData.contacts.s_mobile],
                s_email: [this.formData.contacts.s_email, [Validators.email]],
            }),
            tags: this.fb.array([
                this.fb.control(''),
            ]),
            notes: this.fb.array([
                this.fb.group({
                    type: [],
                    subject: [],
                    created_on: [],
                    created_by: [],
                    private: [],
                    notes: [],
                    format: [],
                }),
            ]),
        });

        this.initTags(this.formData.tags);
        this.initNotes(this.formData.notes);
    }

    trackValuesChanged() {
        if (this.requestMethod === 'put') {
            this.submitted = true;
            this.form.valueChanges.pipe(
                takeWhile(_ => this.alive)
            ).subscribe(formData => {
                this.submitted = false;
            });
        }
    }

    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;

        this.http.request(
            this.requestMethod,
            `${environment.socketUrl}${this.submitEndpoint}`,
            {body: formData},
        ).subscribe((res: any) => {
                console.log(res);
                if (res.Success === true) {
                    this.toasterService.pop('success', 'Success!', res.Message);

                    // switch to updating
                    this.submitText = 'Update';
                    if (this.requestMethod !== 'put') {
                        // UpdatedCampaignID
                        this.heading = 'Update Campaign - ' + res.VendorId;
                    }
                    if (res.VendorId) {
                        this.formData.VendorId = res.VendorId;
                    }
                    this.submitEndpoint = `/campaign/update/${this.formData.VendorId}`;
                    this.requestMethod = 'put';
                    this.trackValuesChanged();
                } else {
                    this.submitted = false;
                    this.showMessages.error = true;
                    this.toasterService.pop('error', res.error.msg);
                    this.errors = [res.error.msg];
                }
            },
            (error) => {
                this.submitted = false;
                this.toasterService.pop('error', 'Something went wrong!', 'Please try again.');
                console.error('Failed to register campaign ', error);
            },
        );
    }

    ngOnDestroy() {
        this.alive = false;
    }

    private initTags(tags: Array<ITag>) {
        if (tags && tags.length > 0) {
            tags.forEach(tag => this.addTag(tag));
        }
    }

    private initNotes(notes: Array<INote>) {
        if (notes && notes.length > 0) {
            notes.forEach(note => this.addNote(note));
        }
    }

    onAddressGotten(addressObject) {
        console.log('Address ', addressObject);
    }
}
