import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {NoteService} from '../../../../services/note.service';
import {IBaseNote} from '../../../../models/base-note';
import {FormOperation} from '../../../../models/form-operation';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-form-create-note',
    templateUrl: './form-create-note.component.html',
    styleUrls: ['./form-create-note.component.scss'],
})
export class FormCreateNoteComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    private _parentid: string;

    /**
     * Form state passed into component
     */
    private _formData: IBaseNote = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';

    @Input() leftButtonText;

    @Output() onSubmitSuccess: EventEmitter<IBaseNote> = new EventEmitter<IBaseNote>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;
    @Input() set parentid(DocId: string) {
        this._parentid = DocId;
        if (this.form) {
            this.form.get('parentid').setValue(DocId);
        }
    }    @Input() set formData(formData: IBaseNote) {
        this._formData = formData;
        if (this.form) {
            this.subject.setValue(formData.subject);
            this.notes.setValue(formData.notes);
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

    get parentid() {
        return this._parentid;
    }

    constructor(
        private fb: FormBuilder,
        private noteService: NoteService,
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

    get subject() {
        return this.form.get('subject');
    }

    get notes() {
        return this.form.get('notes');
    }

    initForm() {
        this.form = this.fb.group({
            parentid: [this.parentid && this.parentid, Validators.required],
            subject: [this.formData && this.formData.subject, Validators.required],
            notes: [this.formData && this.formData.notes, Validators.required],
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
            this.noteService.update({DocId: this.formData.DocId, formData}) :
            this.noteService.create(formData);

        operation$.pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.submitted = false;
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
