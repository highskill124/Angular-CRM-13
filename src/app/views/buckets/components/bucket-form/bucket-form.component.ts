import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {FormOperation} from '../../../../models/form-operation';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {IBucket} from '../../../../models/bucket';
import {BucketService} from '../../../../services/bucket.service';

@Component({
    selector: 'app-bucket-form',
    templateUrl: './bucket-form.component.html',
    styleUrls: ['./bucket-form.component.scss'],
})
export class BucketFormComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    guids = DropdownGuids;

    /**
     * Form state passed into component
     */
    private _formData: IBucket = null;

    @Input() formOperation: FormOperation = 'create';

    @Input() leftButtonText;

    @Output() onSubmitSuccess: EventEmitter<IBucket> = new EventEmitter<IBucket>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;

    categoryOptions$: Observable<Array<IServerDropdownOption>>;
    @Input() set formData(formData: IBucket) {
        this._formData = formData;

        if (this.form) {
            const formDataCopy = {...formData};
            this.form.setValue(formDataCopy);
        }
    }
    get formData() {
        return this._formData;
    }

    constructor(
        private fb: FormBuilder,
        private bucketService: BucketService,
        private cbLookupService: CouchbaseLookupService,
        private toasterService: ToasterService,
    ) {
        super();
        this.categoryOptions$ = this.cbLookupService.getOptions(this.guids.CATEGORIES);
    }

    ngOnInit() {
        this.initForm();
    }

    get formIsReadOnly() {
        return this.formOperation && this.formOperation === 'view';
    }

    get name() {
        return this.form.get('name');
    }

    get goal() {
        return this.form.get('goal');
    }

    get reminder() {
        return this.form.get('reminder');
    }

    get days() {
        return this.form.get('days');
    }

    get categories() {
        return this.form.get('categories');
    }

    initForm() {
        this.form = this.fb.group({
            id: [this.formData && this.formData.id],
            // parentId: [this.parentId && this.parentId, Validators.required],
            name: [this.formData && this.formData.name, Validators.required],
            goal: [this.formData && this.formData.goal, Validators.required],
            reminder: [this.formData && this.formData.reminder],
            days: [this.formData && this.formData.days],
            categories: [this.formData && this.formData.categories],
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
            this.bucketService.update({id: this.formData.id, formData}) :
            this.bucketService.create(formData);

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
