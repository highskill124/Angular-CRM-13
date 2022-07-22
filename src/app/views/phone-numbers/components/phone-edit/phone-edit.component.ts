import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {takeWhile} from 'rxjs/operators';
import {FormOperation} from '../../../../models/form-operation';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {IPhoneNumber} from '../../../../models/phone-number';
import {PhoneNumberService} from '../../../../services/phone-number.service';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactsService } from '../../../../services/contacts/contacts.service';

@Component({
    selector: 'app-form-phone-edit',
    templateUrl: './phone-edit.component.html',
    styleUrls: ['./phone-edit.component.scss'],
})
export class FormPhoneEditComponent implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    formIsReadOnly: boolean = false;

    guids = DropdownGuids;
    saveBttn : string = 'Create'

    private parentId: string;

    /**
     * Form state passed into component
     */
    private _formData: IPhoneNumber = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';

   

    @Output() onSubmitSuccess: EventEmitter<IPhoneNumber> = new EventEmitter<IPhoneNumber>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;

    phoneTypeOptions$: Observable<Array<IServerDropdownOption>>;
    phoneSourceOptions$: Observable<Array<IServerDropdownOption>>;
   
   
  
    

    
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<FormPhoneEditComponent>,
        private fb: FormBuilder,
        private phoneNumberService: PhoneNumberService,
        private cbLookupService: CouchbaseLookupService,
        private toasterService: ToasterService,
        private contactsService: ContactsService,
    ) {

        this.phoneTypeOptions$ = this.phoneNumberService.phoneTypeOptions();
        this.phoneSourceOptions$ = this.cbLookupService.getOptions(this.guids.EMAIL_PHONE_SOURCE);
    }

    ngOnInit() {

    
            console.log(this.data)
            this.parentId = this.data.ParentId;
            this.initForm();
            if (this.data.mode === 'edit') {
                console.log('This will be an Edit')
                this.saveBttn = 'Update'
                this.fetchPhoneInfo(this.data.ParentId, this.data.DocId)
                
               
                
            }
        
            if (this.data.mode === 'new') {
                this.parentId = this.data.ParentId;
                this.form.controls['parentId'].setValue(this.parentId)
                console.log('This will be a New Phone Number')
                this.saveBttn = 'Create'
                
            }
        
       
        }
    
  fetchPhoneInfo( parentId: string, emailId: string) {
    this.phoneNumberService.getPhoneNumberDetail(parentId, emailId).subscribe(
        res =>  {
            console.log(res)
        this.form.controls['parentId'].setValue(parentId)
        this.form.controls['id'].setValue(res.id)
        this.form.controls['type'].setValue(res.type)
        this.form.controls['source'].setValue(res.source)
        this.form.controls['number'].setValue(res.number)
        this.form.controls['sms'].setValue(res.sms)
        this.form.controls['dflt'].setValue(res.dflt)
        this.form.controls['description'].setValue(res.description)
        this.form.markAsPristine()
        }


    )

  }

   get id() {
    return this.form.get('id');
}

    get type() {
        return this.form.get('type');
    }

    get source() {
        return this.form.get('source');
    }

    get number() {
        return this.form.get('number');
    }

    get description() {
        return this.form.get('description');
    }

    get sms() {
        return this.form.get('sms');
    }

    get dflt() {
        return this.form.get('dflt');
    }

    initForm() {

        this.form = this.fb.group({
            id: [''],
            parentId: ['', Validators.required],
            type: ['', Validators.required],
            source: [''],
            number: ['', Validators.required],
            description: [''],
            sms: [''],
            dflt: [''],
        });
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;

        let operation$: Observable<any>;
        operation$ = this.saveBttn === 'Update' ?
            this.phoneNumberService.update({phoneId: this.id.value, formData}) :
            this.phoneNumberService.create(formData);

        operation$
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.submitted = true;
                        // update formData id with id returned by api if current operation is create
                        if (this.saveBttn === 'Create') {
                            formData.id = res.Data && res.Data.id || formData.id;
                            this.form.controls['id'].setValue(res.Data.id || formData.id)
                            this.saveBttn = 'Update' 
                        }
                        this.form.markAsPristine()
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
    closeDialog() {
        console.log('Will Close the dialog')
        this.dialogRef.close({mode: this.saveBttn , reload: this.submitted, data: this.form.value});
    }
}