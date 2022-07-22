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
import {IList} from '../../../../models/list';
import {ListService} from '../../../../services/list.service';

@Component({
    selector: 'app-list-form',
    templateUrl: './list-form.component.html',
    styleUrls: ['./list-form.component.scss'],
})
export class ListFormComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    guids = DropdownGuids;

    /**
     * Form state passed into component
     */
    private _formData: IList = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';

    @Input() leftButtonText;

    @Output() onSubmitSuccess: EventEmitter<IList> = new EventEmitter<IList>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;

    categoryOptions$: Observable<Array<IServerDropdownOption>>;
    @Input() set formData(formData: IList) {
        this._formData = formData;
        console.log(formData);
        if (this.form) {
            const formDataCopy = {...formData};
            this.form.patchValue(formDataCopy);

            this.form.markAsPristine();
            this.form.markAsUntouched();
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
        private listService: ListService,
        private cbLookupService: CouchbaseLookupService,
        private toasterService: ToasterService,
    ) {
        super();
        this.categoryOptions$ = this.cbLookupService.getOptions(this.guids.LIST_CATEGORIES);
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

    get description() {
        return this.form.get('description');
    }

    get category() {
        return this.form.get('category');
    }

    get items() {
        return this.form.get('items');
    }

    initForm() {
        this.form = this.fb.group({
            DocId: [this.formData && this.formData.DocId],
            name: [this.formData && this.formData.name, Validators.required],
            description: [this.formData && this.formData.description],
            category: [this.formData && this.formData.category],
            items: [this.formData && this.formData.items, Validators.required],
        });
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        // igx-combo control output is an object for some reason, so we take only the value attribute from the object
        formData.category = formData.category && formData.category.map(item => item.value);
        this.errors = this.messages = [];
        this.submitted = true;

        this.listService.create(formData)
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.submitted = false;
                        // update formData id with id returned by api if current operation is create
                        if (this.formOperation === 'create') {
                            formData.DocId = res.Data && res.Data.DocId || formData.DocId;
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
