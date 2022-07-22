import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {MailTemplateService} from '../../../../services/mail-template.service';
import {map, takeWhile} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {IMailTemplate} from '../../../../models/mail-template';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {MailTemplateToolbarButtons} from '../../../../models/froala';
import {FroalaUploadService} from '../../../../services/froala-upload.service';
import {environment} from '../../../../../environments/environment';
import FroalaEditor from 'froala-editor';
import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {MatDialog} from '@angular/material/dialog';


@Component({
    selector: 'app-create-mail-template',
    templateUrl: './create-mail-template.component.html',
    styleUrls: ['./create-mail-template.component.scss'],
})
export class CreateMailTemplateComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    @Input() formData: IMailTemplate;
    @Input() submitText = 'Save';
    @Input() heading = 'New Template';
    @Input() operation: 'create' | 'update' = 'create';

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    guids = DropdownGuids;
    editorInstance: any;
    froalaOptions: Object;


    contactFieldsOption: { [key: string]: string; };
    personalFieldsOption: { [key: string]: string; };


    contactFields$: Observable<IServerDropdownOption[]>;
    personalFields$: Observable<IServerDropdownOption[]>;
    tagOptions$: Observable<IServerDropdownOption[]>;
    libraryOptions$: Observable<IServerDropdownOption[]>;

    alive = true;
    contactFieldsOption$: Observable<{ [key: string]: string; }>;
    personalFieldsOption$: Observable<{ [key: string]: string; }>;

    constructor(
        private fb: FormBuilder,
        private mailTemplateService: MailTemplateService,
        private froalaUploadService: FroalaUploadService,
        private router: Router,
        private toasterService: ToasterService,
        private dialog: MatDialog
    ) {
        super();
    }

    transformArr() {
        console.log('Transform Contact Options')
        this.contactFieldsOption$ = this.mailTemplateService.templateLookup(this.guids.MAIL_TEMPLATE_CONTACT_FIELDS)
            .pipe(map(res => {
                this.contactFieldsOption = new Object() as {
                    [key: string]: string
                };

                for (const each of res) {
                    this.contactFieldsOption[each.value.replace('""', '&#34&#34')] = each.name;
                }
                return this.contactFieldsOption;
            }));

        this.personalFieldsOption$ = this.mailTemplateService.templateLookup(this.guids.MAIL_TEMPLATE_PERSONAL_FIELDS)
            .pipe(map(res => {
                this.personalFieldsOption = new Object() as {
                    [key: string]: string
                };

                for (const each of res) {
                    this.personalFieldsOption[each.value.replace('""', '&#34&#34')] = each.name;
                }
                return this.personalFieldsOption;
            }));

        return forkJoin(this.contactFieldsOption$, this.personalFieldsOption$);


    }


    ngOnInit() {
        this.tagOptions$ = this.mailTemplateService.templateLookup(this.guids.MAIL_TEMPLATE_TAGS);
        this.libraryOptions$ = this.mailTemplateService.templateLookup(this.guids.MAIL_TEMPLATE_CATEGORIES);
        // this.createCustomBttm();
        this.initForm();
        this.transformArr();
        this.transformArr().subscribe(
            ([contactFieldsOption, personalFieldsOption]) => this.initializeEditor()
        )


        this.trackValuesChanged();

    }

    get signature() {
        return this.form.get('signature');
    }

    private initializeEditor() {
        this.setFroalaOptions(this);
        // Custom button
        FroalaEditor.DefineIcon('customer_fields', {NAME: 'Customer Fields', template: 'text'});
        FroalaEditor.RegisterCommand('customer_fields', {
            icon: '',
            title: 'Add Contact Fields',
            type: 'dropdown',
            focus: false,
            undo: true,
            refreshAfterCallback: true,
            options: this.contactFieldsOption,
            callback(cmd, val) {
                console.log(val);

                if (this) {
                    // restore selection so element is inserted in the cursor's last known position
                    this.selection.restore();
                    this.html.insert(`${val}`);
                }

            },
            // Callback on refresh.
            refresh($btn) {
                // console.log ('do refresh');
            },
            // Callback on dropdown show.
            refreshOnShow($btn, $dropdown) {
                // console.log ('do refresh when show');
            }

        });
        FroalaEditor.DefineIcon('personal_fields', {NAME: 'Personal Fields', template: 'text'});
        FroalaEditor.RegisterCommand('personal_fields', {
            icon: '',
            title: 'Add Personal Fields',
            type: 'dropdown',
            focus: false,
            undo: true,
            refreshAfterCallback: true,
            options: this.personalFieldsOption,
            callback(cmd, val) {
                console.log(val);

                if (this) {
                    // restore selection so element is inserted in the cursor's last known position
                    this.selection.restore();
                    this.html.insert(`${val}`);
                }

            },
            // Callback on refresh.
            refresh($btn) {
                // console.log ('do refresh');
            },
            // Callback on dropdown show.
            refreshOnShow($btn, $dropdown) {
                // console.log ('do refresh when show');
            }

        });
    }

    initForm() {
        console.log(this.formData)
        this.form = this.fb.group({
            title: [this.formData && this.formData.title],
            goal: [this.formData && this.formData.goal],
            subject: [this.formData && this.formData.subject, [Validators.required]],
            message_body: [this.formData && this.formData.message_body, [Validators.required]],
            signature: [this.formData && this.formData.signature || 'default'],
            tags: [this.formData && this.formData.tags],
            librarys: [this.formData && this.formData.librarys],
        });
        this.trackChanged()
    }

    create(formData) {
        console.log(formData)
        this.errors = this.messages = [];
        this.submitted = true;

        let operation$: Observable<any>;
        if (this.operation === 'update') {
            operation$ = this.mailTemplateService.update({DocId: this.formData.DocId, formData: formData});
        } else {
            operation$ = this.mailTemplateService.create(formData);
        }

        operation$.pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    // console.log(res);
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        // switch to updating
                        this.form.markAsPristine()
                        this.submitText = 'Update';
                        if (this.operation !== 'update') {
                            this.operation = 'update';
                            this.heading = 'Update Template - ' + res.Data.DocId;
                        }
                        formData.DocId = res.Data.DocId;
                        // this.formData = formData;
                        // this.trackValuesChanged();
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

    deleteTemplate() {
        console.log('Delete Template')
        const dialogRef = this.dialog.open(MatDialogComponent,
            {
                data: {
                    message: `Are you sure you want to delete this Template  ${this.formData.DocId}  ?`,
                    title: 'Delete can`t be undone',
                    rightbttntext: 'No'
                },
                disableClose: true, width: '400px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
                autoFocus: false
            })
        console.log('Will Delete Template ID ' + this.formData.DocId)

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                console.log('Will DELETE THIS RECORD');
                const deleteTemplate = this.mailTemplateService.delete(this.formData.DocId)

                deleteTemplate.pipe(
                    takeWhile(_ => this.alive),
                )
                    .subscribe((res: any) => {
                            // console.log(res);
                            if (res.Success === true) {
                                this.toasterService.pop('success', 'Success!', res.Message);
                                // Return to Previous page
                                this.router.navigate(['Emails/TemplateList']);


                            } else {
                                this.showMessages.error = true;
                                this.toasterService.pop('error', res.Message);
                                this.errors = [res.Message];
                            }
                        },
                        (error) => {
                            this.toasterService.pop('error', 'Something went wrong!', 'Please try again.');
                            console.error('Failed to Delet Template ', error);
                        },
                    );


            } else {
                console.log('Will not DELETE THIS RECORD');
            }
        });

    }

    close() {
        console.log(this.form.value)
        console.log(this.form.pristine)
        if (this.form.pristine === true) {
            this.router.navigate(['Emails/TemplateList']);
        } else {
            const dialogRef = this.dialog.open(MatDialogComponent,
                {
                    data: {
                        message: `Do you want to save changes before closing this Template ?`,
                        title: 'Pending Unsaved Changes',
                        rightbttntext: 'No'
                    },
                    disableClose: true, width: '400px', position: {
                        top: '50px'
                    },
                    panelClass:'no-pad-dialog',
                autoFocus: false
                })
            dialogRef.afterClosed().subscribe(result => {
                if (result === true) {
                    console.log('Will Save Changes');
                    this.create(this.form.value)
                } else {
                    this.router.navigate(['Emails/TemplateList']);
                }
            });
        }

    }

    addField($event: IServerDropdownOption) {
        console.log('insert Field');
        if (this.editorInstance) {
            // restore selection so element is inserted in the cursor's last known position
            this.editorInstance.selection.restore();
            this.editorInstance.html.insert(`${$event.value}`);
        }
    }

    private setFroalaOptions(componentInstance) {
        this.froalaOptions = {
            key: environment.froala.license.version3,
            charCounter: true,
            charCounterCount: true,
            toolbarSticky: false,
            attribution: false,
            imageOutputSize: true,
            // zIndex: 2501,
            // zIndex: 10,
            height: 300,
            ...this.froalaUploadService.initUploadOptions(),
            ...this.froalaUploadService.initImageManagerOptions(),
            events: {
                'focus': function (e, editor) {
                    // componentInstance.editorInstance = editor;
                },
                'blur': function () {
                    // save selection so we can restore just before inserting any element
                    // this.selection.save();
                },
                'initialized': function () {
                    componentInstance.editorInstance = this;
                },
                ...this.froalaUploadService.initImageManagerEvents(),
                ...this.froalaUploadService.initUploadEvents(),
            },
            toolbarButtons: MailTemplateToolbarButtons,
        };
    }

    trackValuesChanged() {
        // console.log(this.form.pristine)

        // if (this.operation === 'update') {
        //     this.submitted = true;
        //     this.form.valueChanges.pipe(
        //         takeWhile(_ => this.alive)
        //     ).subscribe(formData => {
        //         this.submitted = false;
        //     });
        // }
    }

    trackChanged() {
        this.form.valueChanges.subscribe(
            val => console.log(this.form.pristine)
        )

    }

    ngOnDestroy() {
        this.alive = false;
    }
}
