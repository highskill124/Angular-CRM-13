import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {NoteService} from '../../../../services/note.service';
import {IBaseNote} from '../../../../models/base-note';
import {FormOperation} from '../../../../models/form-operation';
import {Observable} from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogComponent } from '../../../../modules/mat-dialog/mat-dialog.component';

@Component({
    selector: 'app-create-note',
    templateUrl: './create-note.component.html',
    styleUrls: ['./create-note.component.scss'],
})
export class CreateNoteComponent implements OnInit, OnDestroy {

    @Output() reloadGrid: EventEmitter<boolean> = new EventEmitter<boolean>();

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    ParentId = '';
    formOperation = 'new';
    saveButton = 'Create'
    formData: IBaseNote = null;
    relaodPending = false;

    editorInstance: any;
    froalaOptions: Object;

    alive = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateNoteComponent>,
        private fb: FormBuilder,
        private noteService: NoteService,
        private toasterService: ToasterService,
    ) {

    }

    ngOnInit() {
        this.initForm();
        this.ParentId = this.data.ParentId
        console.log(this.data)
        if (this.data.mode === 'new') {

            this.form.controls['parentId'].patchValue(this.ParentId)
        } else {
            this.saveButton = 'Update'
            this.formOperation = 'update';
            this.fetchTaskInfo(this.data.DocId)
        }

        this.setFroalaOptions(this);

    }

 
    get subject() {
        return this.form.get('subject');
    }

    get notes() {
        return this.form.get('notes');
    }

    get created_by_name() {
        return this.form.get('created_by_name').value;
    }
    get created_on() {
        return this.form.get('created_on').value;
    }
    get updated_by_name() {
        return this.form.get('updated_by_name').value;
    }
    get updated_on() {
        return this.form.get('updated_on').value;
    }

    initForm() {
        this.form = this.fb.group({
            subject: ['', Validators.required],
            notes: ['', Validators.required],
            parentId: ['', Validators.required],
            DocId: [''],
            created_on: [''],
            created_by_name: [''],
            created_by: [''],
            updated_on: [''],
            updated_by_name: [''],
            updated_by: ['']
        });
    }


    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;


        let operation$: Observable<any>;
        operation$ = this.saveButton  === 'Update' ?
            this.noteService.update({DocId: this.data.DocId, formData}) :
            this.noteService.create(formData);

        operation$.pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.submitted = false;
                        if (this.saveButton === 'Create') {
                            this.form.controls['DocId'].patchValue(res.DocId)
                            this.data.DocId = res.DocId;
                        }
                        this.relaodPending = true;
                        this.saveButton = 'Update'
                        this.form.markAsPristine()
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

    printDebug(form) {
        console.log(form)
    }

    ngOnDestroy() {
        this.alive = false;
    }


    fetchTaskInfo( DocId: string) {
        this.noteService.fetch(DocId).subscribe(
            res =>  {
            this.formData = res;
            console.log(res);
            this.form.controls['parentId'].setValue(res.parentid)
            this.form.controls['DocId'].setValue(res.DocId)
            this.form.controls['notes'].setValue(res.notes)
            this.form.controls['subject'].setValue(res.subject)
            this.form.controls['created_on'].setValue(new Date(res.created_on))
            this.form.controls['created_by'].setValue(res.created_on)
            this.form.controls['created_by_name'].setValue(res.created_by_name)
            this.form.controls['updated_by_name'].setValue(res.updated_by_name)
            this.form.controls['updated_on'].setValue(new Date(res.updated_on))

            }
        )
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
          height: 300,
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
          // toolbarButtons: [ 'print'],
          // toolbarButtons: ToolbarButtons
        };
      }

    close() {
        // Check if form is Dirty / unsaved Data
        if (this.form.dirty === true) {
            const dialogRef = this.dialog.open(MatDialogComponent,
                {
                    data: {message: 'Are you sure you want to discard unsaved changes ?', title: 'Unsaved Data will be lost', rightButtonText: 'No'},
                    disableClose: true, width: '500px', position: {
                        top: '100px'
                    },
                    panelClass: 'inner-no-pad-dialog',
                    autoFocus: false
                })
            dialogRef.afterOpened().subscribe(
                opend => {
                    document.querySelector('.inner-no-pad-dialog').parentElement.classList.add('no-relv')
                }
            )
    
            dialogRef.afterClosed().subscribe(result => {
                if (result === true) {
                    console.log('Will Discard Changes');
                    if( this.relaodPending === true) {
                        this.reloadGrid.emit(true)
                    }
                    this.dialogRef.close()
    
    
                } else {
                    console.log('Waiting for user to save data');
                }
            });



        } else {
            if( this.relaodPending === true) {
                this.reloadGrid.emit(true)
            }
            this.dialogRef.close()
        }
    }

}
