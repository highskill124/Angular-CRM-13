import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {map, startWith, takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {FormOperation} from '../../../../models/form-operation';
import {combineLatest, Observable} from 'rxjs';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {IFarmOwners} from '../../../../models/farm';
import {FarmOwnersService} from '../../../../services/farm-owners.service';

@Component({
    selector: 'app-form-create-farm-owner',
    templateUrl: './form-create-farm-owner.component.html',
    styleUrls: ['./form-create-farm-owner.component.scss'],
})
export class FormCreateFarmOwnerComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    private _parentId: string;

    /**
     * Form state passed into component
     */
    private _formData: IFarmOwners = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';

    @Input() leftButtonText;

    @Output() onSubmitSuccess: EventEmitter<IFarmOwners> = new EventEmitter<IFarmOwners>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;
    @Input() set parentId(contactId: string) {
        this._parentId = contactId;
        if (this.form) {
            this.form.get('parentId').setValue(contactId);
        }
    }
    get parentId() {
        return this._parentId;
    }
    @Input() set formData(formData: IFarmOwners) {
        this._formData = formData;
        if (this.form) {

            const formDataCopy = {...formData};
            // formDataCopy.parentId = this.parentId;
            this.form.setValue(formDataCopy);
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
        private farmOwnersService: FarmOwnersService,
        private cbLookupService: CouchbaseLookupService,
        private toasterService: ToasterService,
    ) {
        super();
    }

    ngOnInit() {
        this.initForm();
    }

    get formIsReadOnly() {
        return this.formOperation && this.formOperation === 'view';
    }

    get owner1FName() {
        return this.form.get('owner1FName');
    }

    get owner1FullName() {
        return this.form.get('owner1FullName');
    }

    get owner1LName() {
        return this.form.get('owner1LName');
    }

    get owner1MName() {
        return this.form.get('owner1MName');
    }

    get owner1SpouseFName() {
        return this.form.get('owner1SpouseFName');
    }

    get owner1SpouseLName() {
        return this.form.get('owner1SpouseLName');
    }

    get owner1SpouseMName() {
        return this.form.get('owner1SpouseMName');
    }

    get owner2FName() {
        return this.form.get('owner2FName');
    }

    get owner2FullName() {
        return this.form.get('owner2FullName');
    }

    get owner2LName() {
        return this.form.get('owner2LName');
    }

    get owner2MName() {
        return this.form.get('owner2MName');
    }

    get owner2SpouseFName() {
        return this.form.get('owner2SpouseFName');
    }

    get owner2SpouseLName() {
        return this.form.get('owner2SpouseLName');
    }

    get owner2SpouseMName() {
        return this.form.get('owner2SpouseMName');
    }

    initForm() {
        this.form = this.fb.group({
            id: [this.formData && this.formData.id],
            parentId: [this.parentId && this.parentId],
            owner1FName: [this.formData && this.formData.owner1FName],
            owner1FullName: [this.formData && this.formData.owner1FullName],
            owner1LName: [this.formData && this.formData.owner1LName],
            owner1MName: [this.formData && this.formData.owner1MName],
            owner1SpouseFName: [this.formData && this.formData.owner1SpouseFName],
            owner1SpouseLName: [this.formData && this.formData.owner1SpouseLName],
            owner1SpouseMName: [this.formData && this.formData.owner1SpouseMName],
            owner2FName: [this.formData && this.formData.owner2FName],
            owner2FullName: [this.formData && this.formData.owner2FullName],
            owner2LName: [this.formData && this.formData.owner2LName],
            owner2MName: [this.formData && this.formData.owner2MName],
            owner2SpouseFName: [this.formData && this.formData.owner2SpouseFName],
            owner2SpouseLName: [this.formData && this.formData.owner2SpouseLName],
            owner2SpouseMName: [this.formData && this.formData.owner2SpouseMName],
            ownerNameFormatted: [this.formData && this.formData.ownerNameFormatted],
            ownerNameS: [this.formData && this.formData.ownerNameS],
        });

        this.setOwner1FullName();
        this.setOwner2FullName();
    }

    setOwner1FullName() {
        combineLatest([
            this.owner1FName.valueChanges.pipe(startWith([this.owner1FName.value])),
            this.owner1MName.valueChanges.pipe(startWith([this.owner1MName.value])),
            this.owner1LName.valueChanges.pipe(startWith([this.owner1LName.value])),
        ]).pipe(
            takeWhile(() => this.alive),
            map(([firstName, middleName, lastName]) => {
                return `${firstName && firstName + ' '}${middleName && middleName + ' '}${lastName && lastName}`;
            })
        ).subscribe((result) => {
            // check to see if there's at least one character of non whitespace
            if (/\S/.test(result)) {
                this.owner1FullName.setValue(result.trim());
            } else {
                this.owner1FullName.setValue('');
            }
        });
    }

    setOwner2FullName() {
        combineLatest([
            this.owner2FName.valueChanges.pipe(startWith([this.owner2FName.value])),
            this.owner2MName.valueChanges.pipe(startWith([this.owner2MName.value])),
            this.owner2LName.valueChanges.pipe(startWith([this.owner2LName.value])),
        ]).pipe(
            takeWhile(() => this.alive),
            map(([firstName, middleName, lastName]) => {
                return `${firstName && firstName + ' '}${middleName && middleName + ' '}${lastName && lastName}`;
            })
        ).subscribe((result) => {
            // check to see if there's at least one character of non whitespace
            if (/\S/.test(result)) {
                this.owner2FullName.setValue(result.trim());
            } else {
                this.owner2FullName.setValue('');
            }
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
            this.farmOwnersService.update({formData}) :
            this.farmOwnersService.create(formData);

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
