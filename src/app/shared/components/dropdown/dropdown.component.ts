import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {IServerDropdownOption} from '../../../models/server-dropdown';
import {FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {BaseControlValueAccessor} from '../../BaseControlValueAccessor';
import {IsRequiredValidator} from '../../directives/is-required-validator.directive';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropdownComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DropdownComponent),
            multi: true,
        },
    ],
})
export class DropdownComponent extends BaseControlValueAccessor<string> implements OnInit {

    form: FormGroup;
    validateFn: Function;

    alive = true;

    private _options: IServerDropdownOption[];

    @Input() placeholder = '';
    @Input() label = '';
    @Input() prefix = '';
    @Input() isRequired = false;

    @Output() optionSelected = new EventEmitter<string>();

    @Input() set options(options: IServerDropdownOption[]) {
        this._options = options;
        if (this.form) {
            this.cd.detectChanges();
        }
    }

    get options() {
        return this._options;
    }

    constructor(
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
    ) {
        super();
    }

    public ngOnInit() {
        this.validateFn = IsRequiredValidator(this.isRequired);
        this.initForm();

        /**
         * A reference to the underlying control (parent control).
         */
        // console.log('control value ', control.value);
        if (this.isRequired) {
            this.selected.setValidators(Validators.required);
            this.selected.updateValueAndValidity();
            this.form.updateValueAndValidity();
        }
    }

    public initForm() {
        this.form = this.fb.group({
            selected: [this.value],
        });

        this.selected.setValue(this.value);
        this.form.valueChanges.subscribe((res) => {
            this.onChange(res?.selected);
            this.optionSelected.emit(res?.selected);
        })
    }

    get selected() {
        return this.form && this.form.get('selected');
    }

    writeValue(value) {
        this.value = value;
        this.selected.setValue(this.value);
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

    onInputChange(value) {
        console.log(value);
        this.onChange(value);
        this.optionSelected.emit(value);
    }
}
