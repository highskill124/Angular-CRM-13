import { ContactsService } from './../../../../services/contacts/contacts.service';
import { Component, OnInit , Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { IServerDropdownOption } from '../../../../models/server-dropdown';
import { EmailService } from '../../../../services/email.service';
import { CouchbaseLookupService } from '../../../../services/couchbase-lookup.service';
import { DropdownGuids } from '../../../../models/dropdown-guids.enum';
import { ToasterService } from 'angular2-toaster';
import { IEmail } from '../../../../models/email';
import { takeWhile } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-email-edit',
    templateUrl: './email-edit.component.html',
    styleUrls: ['./email-edit.component.scss']
})
export class EmailEditComponent implements OnInit {

  public items: string[] = [];
  DropDownData: IServerDropdownOption[]
  submitted = false;
  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  parentId: string

  dnmm: boolean
  equityUpdate: boolean
  generalMarketing: boolean
  ocHousing: boolean

  emailTypeOptions$: Observable<Array<IServerDropdownOption>>;
  emailSourceOptions$: Observable<Array<IServerDropdownOption>>;
  public form: FormGroup;
  guids = DropdownGuids;
  email: IEmail
  bounce: boolean
  saveBttn: string
  alive = true;
  header = {}
  pipe = new DatePipe('en-US'); // Use your own locale


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EmailEditComponent>,
    private emailService: EmailService,
    private cbLookupService: CouchbaseLookupService,
    private contactsService: ContactsService,
    private toasterService: ToasterService,
    fb: FormBuilder
    ) {
    this.form = fb.group({
        id: [''],
        parentId: [''],
        type: ['', Validators.required],
        address: ['', Validators.required],
        name: [''],
        otherLabel: [''],
        dflt: [''],
        dnmm: [''],
        bounce: [''],
        source: [''],
        equityUpdate:  [''],
        generalMarketing:  [''],
        ocHousing:  [''],
        historyChangeDate: {value: '', disabled: true},
        historyIp: {value: '', disabled: true},
        historySource:  {value: '', disabled: true},
        historyHeader:  {value: '', disabled: true}
    });
    this.emailTypeOptions$ = this.emailService.emailTypeOptions();
    this.emailSourceOptions$ = this.cbLookupService.getOptions(this.guids.EMAIL_PHONE_SOURCE);

  }

ngOnInit(): void {
    console.log(this.data)
    this.parentId = this.data.ParentId;
    if (this.data.mode === 'edit') {
        console.log('This will be an Edit')
        this.saveBttn = 'Update'
        this.fetchContactInfo(this.data.ParentId, this.data.DocId)
        this.setFormValues()
    }

    if (this.data.mode === 'new') {
        this.parentId = this.data.ParentId;
        this.form.controls['parentId'].setValue(this.parentId)
        console.log('This will be a New Address')
        this.saveBttn = 'Create'
    }


}
  public onSubmit() {
    this.dialogRef.close();
  }

  getTempData() {
    return of(this.DropDownData);
  }

  onNativeChangeAC(e: any) {
    if(this.form.value.equityUpdate === true || this.form.value.generalMarketing === true || this.form.value.ocHousing === true){
      console.log('Check Box is true')
      this.form.controls['dnmm'].patchValue(false)
  
    }
  }

 
  onNativeChangeD(e: any) {
    if(this.form.value.dnmm === true){
      console.log('Check Box is DNM true')
      this.form.controls['ocHousing'].patchValue(false)
      this.form.controls['generalMarketing'].patchValue(false)
      this.form.controls['equityUpdate'].patchValue(false)
    }
  }


  fetchContactInfo( parentId: string, emailId: string) {
    this.contactsService.getEmailDetail(parentId, emailId).subscribe(
        res =>  {
        this.form.controls['parentId'].setValue(parentId)
        this.form.controls['id'].setValue(res.id)
        this.form.controls['address'].setValue(res.address),
        this.form.controls['name'].setValue(res.name)
        this.form.controls['type'].setValue(res.type)
        this.form.controls['otherLabel'].setValue(res.otherLabel)
        this.form.controls['source'].setValue(res.source)
        this.form.controls['bounce'].setValue(res.bounce)
        this.form.controls['dnmm'].setValue(res.dnmm)
        this.form.controls['dflt'].setValue(res.dflt)
        this.form.controls['equityUpdate'].setValue(res.equityUpdate)
        this.form.controls['generalMarketing'].setValue(res.generalMarketing)
        this.form.controls['ocHousing'].setValue(res.ocHousing)


        this.form.controls['historyChangeDate'].setValue(this.pipe.transform(res.history?.changeDate, 'long'))
        this.form.controls['historyIp'].setValue(res.history?.ip)
        this.form.controls['historySource'].setValue(res.history?.source)

      
        this.header = res.history?.header
    


        }


    )

  }

  setFormValues() {
    // this.form.controls['address'].setValue('Test Value')

  }



  create(formData: IEmail) {
    this.errors = this.messages = [];
    this.submitted = true;

    let operation$: Observable<any>;
    operation$ = this.saveBttn === 'Update' ?
        this.emailService.update({emailId: formData.id , formData}) :
        this.emailService.create(formData);

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
                    }
                    this.saveBttn = 'Update';
                    this.form.markAsPristine()
                } else {
                    this.submitted = false;
                    this.showMessages.error = true;
                    this.toasterService.pop('error', res.Message);
                    this.errors = [res.Message];
                }
            },
            (error) => {
                console.log(error)
                this.submitted = false;
                this.toasterService.pop('error', 'Something went wrong!', 'Please try again.');
            },
        );
}
// tslint:disable-next-line: use-life-cycle-interface
ngOnDestroy() {
    this.alive = false;
}

closeDialog() {
    this.dialogRef.close({mode: this.saveBttn , reload: this.submitted, data: this.form.value});
  }

}
