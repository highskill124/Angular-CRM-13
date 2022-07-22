import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {shareReplay, takeWhile} from 'rxjs/operators';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {IInteraction} from '../../../../models/contact-interaction';
import {InteractionService} from '../../../../services/interaction.service';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {Observable} from 'rxjs';
import {FormOperation} from '../../../../models/form-operation';

@Component({
    selector: 'app-create-interaction-form',
    templateUrl: './create-interaction-form.component.html',
    styleUrls: ['./create-interaction-form.component.scss'],
})
export class CreateInteractionFormComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    /**
     * contact id passed into component
     */
    private _parent_id = '';

    /**
     * Form state passed into component
     */
    private _formData: IInteraction = null;

    /**
     * form operation passed into component
     */
    private _formOperation: FormOperation = 'create';

    @Input() leftButtonText;

    interactionMethods$: Observable<IServerDropdownOption[]>;

    @Output() onSubmitSuccess: EventEmitter<Partial<IInteraction>> = new EventEmitter<Partial<IInteraction>>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;
    @Input() set parent_id(parent_id: string) {
        this._parent_id = parent_id;
        if (this.form) {
            this.form.get('parent_id').setValue(parent_id);
        }
    }
    get parent_id() {
        return this._parent_id;
    }
    @Input() set formData(formData: IInteraction) {
        this._formData = formData;
        if (this.form) {
            this.method.setValue(formData.type);
            /**
             * @note: Assuming here that date and time are required fields in the form so they'll always be present
             */
            this.date.setValue(new Date(formData.time).toLocaleDateString());
            this.time.setValue(new Date(formData.time));
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

    constructor(
        private fb: FormBuilder,
        private interactionsService: InteractionService,
        private toasterService: ToasterService,
    ) {
        super();
    }

    ngOnInit() {
        this.interactionMethods$ = this.interactionsService.methodsList().pipe(shareReplay());
        this.initForm();
    }

    get formIsReadOnly() {
        return this.formOperation && this.formOperation === 'view';
    }

    get method() {
        return this.form.get('method');
    }

    get date() {
        return this.form.get('date');
    }

    get time() {
        return this.form.get('time');
    }

    get subject() {
        return this.form.get('subject');
    }

    get notes() {
        return this.form.get('notes');
    }

    initForm() {
        this.form = this.fb.group({
            parent_id: [this.parent_id, [Validators.required]],
            method: [this.formData && this.formData.type],

            date: [this.formData && this.formData.time
                ? new Date(this.formData.time).toLocaleDateString()
                : new Date().toLocaleDateString(), [Validators.required]],

            time: [this.formData && this.formData.time
                ? new Date(this.formData.time) :
                new Date(), [Validators.required]],

            subject: [this.formData && this.formData.subject, [Validators.required]],
            notes: [this.formData && this.formData.notes],
        });
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        if (formData.date) {
            const time = new Date(formData.date);
            if (formData.time) {
                time.setHours(new Date(formData.time).getHours());
                time.setMinutes(new Date(formData.time).getMinutes());
            }
            formData.date = time;
            formData.time = time;
        }

        this.errors = this.messages = [];
        this.submitted = true;

        let operation$: Observable<any>;
        operation$ = this.formOperation === 'update' ?
            this.interactionsService.update({DocId: this.formData.DocId, formData}) :
            this.interactionsService.create(formData);

        operation$.pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    // console.log(res);
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
