import { Component, OnInit, Input, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import FroalaEditor from 'froala-editor';
import { of, Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { EmailService } from '../../../../services/email.service';
import { DateAndTimeRenderer } from '../../../../modules/custom-ag-grid/render-functions/date-renderer';

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit {


  result: { [key: string]: string };
  keys: string[] = [];


  DocId: string;
  form: FormGroup;
  submitted = false;
  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  editorInstance: any;
 

  froalaOptions: Object;
  showbcc = true;
  showcc = true;



  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmailViewComponent>,
    private emailService: EmailService

  ) {}
  initForm() {
    this.form = new FormGroup({
      title: new FormControl(),
      goal: new FormControl(),
      subject: new FormControl(''),
      message_body: new FormControl(),
      to: new FormControl(),
      from: new FormControl(),
      cc: new FormControl(),
      bcc: new FormControl(),
      tracking_nbr : new FormControl(),
      send_datetime : new FormControl(),
    });
    this.setFroalaOptions(this);

  }
  ngOnInit() {
    this.initForm();
    this.DocId = this.data.DocId
    console.log(this.DocId)
    if (this.data.mode === 'view') {

        this.loadEmail()

    }
  }

  get formf() {
    return this.form.controls;
  }

  create(formData) {
    this.form.markAsPristine();
  }

  printDebug() {
    console.log(`Current Pristine Status ${this.form.pristine} `);
  }


  trackChanges() {
    this.form.valueChanges.subscribe(val => console.log(this.form.pristine));
  }

  
  private setFroalaOptions(componentInstance) {
    this.froalaOptions = {
      key: '1C%kZV[IX)_SL}UJHAEFZMUJOYGYQE[\\ZJ]RAe(+%$==',
      charCounter: true,
      charCounterCount: true,
      toolbarSticky: false,
      attribution: false,
      imageOutputSize: true,
      // zIndex: 2501,
      // zIndex: 10,
      height: 500,
      // ...this.froalaUploadService.initUploadOptions(),
      // ...this.froalaUploadService.initImageManagerOptions(),
      events: {
        focus: function(e, editor) {
          // componentInstance.editorInstance = editor;
        },
        blur: function() {
          // save selection so we can restore just before inserting any element
          this.selection.save();
        },
        initialized: function() {
          componentInstance.editorInstance = this;
        }
        // ...this.froalaUploadService.initImageManagerEvents(),
        // ...this.froalaUploadService.initUploadEvents(),
      },
      toolbarButtons: [ 'print'],
      // toolbarButtons: ToolbarButtons
    };
  }

  loadEmail() {
    this.emailService.getMessageDetail(this.DocId).subscribe((response: any) => {
        this.form.controls['subject'].setValue(response.Data.subject)
        this.form.controls['message_body'].setValue(response.Data.message_body)
        this.form.controls['cc'].setValue(response.Data.send_cc)
        this.form.controls['bcc'].setValue(response.Data.send_bcc)
        this.form.controls['to'].setValue(response.Data.send_to)
        this.form.controls['from'].setValue(response.Data.send_from)
        this.form.controls['tracking_nbr'].setValue(response.Data.tracking_nbr)
        this.form.controls['send_datetime'].setValue(DateAndTimeRenderer(response.Data.send_DateTime))
        
        if (response.Data.send_bcc.length > 0) {
            this.showbcc = true
        } else {
            this.showbcc = true
        }

        if (response.Data.send_cc.length > 0) {
            this.showcc = true
        } else {
            this.showcc = true
        }


        

        console.log(response)
    })

}

close()
    // Close Email Viewer
    {
        this.dialogRef.close()

    }

    get send_datetime() {
        return this.form.get('send_datetime').value}
}

