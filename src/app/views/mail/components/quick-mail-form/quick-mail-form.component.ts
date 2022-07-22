import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs';
import { IServerDropdownOption, ServerDropdownOption } from '../../../../models/server-dropdown';
import { filter, takeWhile, tap } from 'rxjs/operators';
import { FormCanDeactivate } from '../../../../guards/form-can-deactivate/form-can-deactivate';
import { ImageEditButtons, insertHtmlField, MailTemplateToolbarButtons, QuickMailToolbarButtons } from '../../../../models/froala';
import { Button } from '../../../../models/button';
import { MailService } from '../../../../services/mail.service';
import { IMailTemplate } from '../../../../models/mail-template';
import { ContactsService } from '../../../../services/contacts/contacts.service';
import { FroalaUploadService } from '../../../../services/froala-upload.service';
import { AddEmailComponent } from '../../../contacts/components/add-email/add-email.component';
import { environment } from '../../../../../environments/environment';
import FroalaEditor from 'froala-editor';
import { ButtonToggleComponent } from '../../../../shared/components/button-toggle/button-toggle.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-quick-mail-form',
    templateUrl: './quick-mail-form.component.html',
    styleUrls: ['./quick-mail-form.component.scss'],
    providers: [FroalaUploadService]
})
export class QuickMailFormComponent extends FormCanDeactivate implements OnInit, AfterViewInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];
    DocId: string = null;

    isDirty: boolean = false;

    emailOptions$: Observable<Array<ServerDropdownOption>>;
    emailFromOptions$: Observable<Array<ServerDropdownOption>>;
    templateOptions$: Observable<Array<ServerDropdownOption>>;
    // set email options only when user starts typing in input box, that is create observable

    editorInstance: any;
    froalaOptions: Object;

    alive = true;
    // trackButtons: Button[]
    trackOptions: Button[];

    @ViewChild('buttonToggle') public buttonToggle: ButtonToggleComponent;

    constructor(
        private fb: FormBuilder,
        private mailService: MailService,
        private contactService: ContactsService,
        private toasterService: ToasterService,
        private froalaUploadService: FroalaUploadService,
        private dialogRef: MatDialogRef<QuickMailFormComponent>,
    ) {
        super();
        this.setFroalaOptions(this);
        this.templateOptions$ = this.mailService.templates();
        this.emailFromOptions$ = this.mailService.emailFromAddresses()
            .pipe(
                tap(options => {
                    const selectedOption = options.find(option => option.selected);
                    if (selectedOption) {
                        this.form.get('from').setValue(selectedOption.value);
                    }
                })
            );

            this.trackOptions = [
                // index = 0
                new Button({
                  id: 0,
                  icon: 'mail',
                  selected: true,
                  togglable: true,
                  label: 'Track message',
                  color: 'orange',
                  tooltip: 'Track Message',
                }),
                // index = 1
                new Button({
                  id: 1,
                  icon: 'cached',
                  togglable: true,
                  selected: false,
                  label: 'track click',
                  // color: 'orange',
                  tooltip: 'Track Click',
                }),
                // index = 2
                new Button({
                  id: 2,
                  icon: 'reply',
                  selected: false,
                  togglable: true,
                  label: 'Track reply',
                  // color: 'orange',
                  tooltip: 'Track Reply',
                }),
                // index = 3
                new Button({
                  id: 3,
                  icon: 'add_alert',
                  togglable: true,
                  label: 'Notify user',
                  // color: 'orange',
                  tooltip: 'Notify User',
                }),
                new Button({
                  id: 4,
                  icon: 'person',
                  togglable: true,
                  label: 'Notify',
                  // color: 'orange',
                  tooltip: 'Default Signiture',
                }),
              ];
    }

    ngOnInit() {
        this.initForm();
        this.form.valueChanges.subscribe(() => {
            this.isDirty = this.form.dirty
        });
    }


    ngAfterViewInit() {
      
    }

    get subject() {
        return this.form.get('subject');
    }

    get track_message() {
        return this.form.get('track_message');
    }

    get track_click() {
        return this.form.get('track_click');
    }

    get track_reply() {
        return this.form.get('track_reply');
    }

    get notify_user() {
        return this.form.get('notify_user');
    }

    get cc() {
        return this.form.get('cc') as FormControl;
    }

    get bcc() {
        return this.form.get('bcc') as FormControl;
    }

    get signature() {
        return this.form.get('signature');
    }

    get message_body() {
        return this.form.get('message_body') as FormControl;
    }

    initForm() {
        this.form = this.fb.group({
            from: ['', [Validators.required]],
            to: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            message_body: ['', [Validators.required]],
            cc: [{ value: '', disabled: true }],
            bcc: [{ value: '', disabled: true }],
            signature: [false],
            track_message: [true],
            track_click: [false],
            track_reply: [false],
            notify_user: [false],
            toggle: []
        });
    }

    setEmailOptions(searchValue) {
        this.emailOptions$ = this.contactService.emailLookup(searchValue);
    }


    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;
        this.resetToggleOption()
        this.setMultiSelectOption(this.form.value.toggle)


        this.mailService.create(this.form.value).pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                if (res.Success === true) {
                    this.toasterService.pop('success', 'Success!', res.Message);
                    this.submitted = false;
                    this.DocId = res.Data.DocId;
                    // disable form
                    this.form.controls['to'].reset()
                    // this.form.reset();
                    // this.initTrackOptions();
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

    resetForm() {
       
        this.form.controls['to'].reset()
        this.form.controls['cc'].reset()
        this.form.controls['bcc'].reset()
        this.form.controls['subject'].reset()
        this.form.controls['message_body'].reset()
        this.form.markAsPristine()
    }

    close() {
        console.log('Closing Form')
        console.log(this.form.value.toggle)
        this.resetToggleOption()
        this.setMultiSelectOption(this.form.value.toggle)

    }

    setMultiSelectOption( ids: number[]) {
        for (let i = 0; i < ids.length; i++) {
            console.log(ids[i]);
            this.toggleOption(ids[i])

    }
    console.log(this.form.value)
}


    private setFroalaOptions(componentInstance) {
        this.froalaOptions = {
            key: environment.froala.license.version3,
            attribution: false,
            charCounter: true,
            charCounterCount: true,
            height: 300,
            imageOutputSize: true,
            /**
             * without this image edit buttons don't show
             * Note: This value should not be greater than the z-index value of overlay (modal) containers
             * to avoid them appearing behind the editor. Modal containers generally have z-index value 10.
             * @see https://www.smashingmagazine.com/2019/04/z-index-component-based-web-application/
             */
          
            toolbarSticky: false,
            ...this.froalaUploadService.initUploadOptions(),
            ...this.froalaUploadService.initImageManagerOptions(),

            events: {
                'focus': function (e, editor) {
                    // componentInstance.editorInstance = editor;
                },
                'blur': function () {
                    // save selection so we can restore just before inserting any element
                    this.selection.save();
                },
                'initialized': function () {
                    componentInstance.editorInstance = this;
                },
                ...this.froalaUploadService.initImageManagerEvents(),
                ...this.froalaUploadService.initUploadEvents(),
            },
            toolbarButtons: QuickMailToolbarButtons ,

            // imageEditButtons: [...ImageEditButtons]
        };
    }


    ngOnDestroy() {
        this.alive = false;

    }

    addField($event: IServerDropdownOption) {
        this.mailService.templateDetail($event.value).pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: IMailTemplate) => {
                if (!this.signature.value) {
                    this.signature.setValue(res.signature);
                }
                if (this.subject.value && this.subject.value.length && confirm(`Update subject?`)) {
                    this.subject.setValue(this.subject.value ? `${this.subject.value} ${res.subject}` : res.subject);
                } else {
                    this.subject.setValue(res.subject);
                }
                if (this.editorInstance) {
                    if (this.message_body.value && confirm(`Clear editor content?`)) {
                        this.editorInstance.html.set('');
                    }
                    insertHtmlField(this.editorInstance, res.message_body);
                }
            });
    }

    toggleOption(index : number ) {
        // log
 
        switch (index) {
            case 0: // track message
                this.track_message.setValue(true);
                break;
            case 1: // track click
                this.track_click.setValue(true);
                break;
            case 2: // track reply
                this.track_reply.setValue(true);
                break;
            case 3: // notify user
                this.notify_user.setValue(true);
                break;
            case 4: // default signature
                this.signature.setValue(true);
                break;

            default:
            //
        }
    }


    resetToggleOption() {
                this.track_message.setValue(false);
                this.track_click.setValue(false);
                this.track_reply.setValue(false);
                this.notify_user.setValue(false);
                this.signature.setValue(false);
        }


    toggleControlDisplay(c: FormControl) {
        if (c.enabled) {
            c.disable();
        } else {
            c.enable();
        }
    }

    dialogSaveEmail(email: string) {
        // const overlayId = this.overlayService.show(AddEmailComponent);

        // this.overlayService.onOpened.pipe(
        //     takeWhile(_ => this.alive),
        //     filter(event => !!(event.componentRef && event.componentRef.instance)),
        // )
        //     .subscribe(($overlayEvent: OverlayEventArgs) => {
        //         // @ts-ignore
        //         const componentInstance = $overlayEvent.componentRef.instance as AddEmailComponent;
        //         componentInstance.email = email;
        //         componentInstance.onDismiss.pipe(
        //             takeWhile(_ => this.alive),
        //         )
        //             .subscribe($dismissEvent => {
        //                 this.overlayService.hide(overlayId);
        //             });
        //     });
    }
}
