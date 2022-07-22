import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {IgxDropDownComponent, IgxInputDirective, IgxInputGroupComponent} from 'igniteui-angular';
import {FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {BaseControlValueAccessor} from '../../BaseControlValueAccessor';
import {IsRequiredValidator} from '../../directives/is-required-validator.directive';

@Component({
    selector: 'app-date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateInputComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DateInputComponent),
            multi: true,
        },
    ],
})
export class DateInputComponent extends BaseControlValueAccessor<string> implements OnInit {

    @ViewChild(IgxDropDownComponent) public igxDropDown: IgxDropDownComponent;
    @ViewChild('inputGroup', {read: IgxInputGroupComponent}) public inputGroup: IgxInputGroupComponent;
    @ViewChild('input', {read: IgxInputDirective})
    public input: IgxInputDirective;

    form: FormGroup;
    validateFn: Function;

    // private _disabled = false;

    @Input() placeholder = 'mm/dd/yyyy';
    @Input() label = null;
    @Input() isRequired = false;
    @Input() set disabled(isDisabled: boolean) {
        this._disabled = isDisabled;
    }
    get disabled() {
        return this._disabled;
    }

    constructor(private fb: FormBuilder) {
        super();
    }

    public ngOnInit() {
        this.validateFn = IsRequiredValidator(this.isRequired);
        this.initForm();
    }

    public initForm() {
        this.form = this.fb.group({
            date: [this.value],
        });

        if (this.isRequired) {
            this.date.setValidators(Validators.required);
            this.date.updateValueAndValidity();
            this.form.updateValueAndValidity();
        }

        this.form.valueChanges.subscribe(formData => {
            this.onChange(formData.date);
            this.value = formData.date;
        });
    }

    get date() {
        return this.form && this.form.get('date');
    }

    getDate(dateString: string) {
        if (dateString && dateString.length) {
            return new Date(dateString);
        } else {
            return dateString;
        }
    }

    setDate($event: Date) {
        const dateString = $event.toLocaleDateString();
        this.onChange(dateString);
        this.date.setValue(dateString);
        this.value = dateString;
    }

    writeValue(dateValue: string) {
        this.date.setValue(dateValue);
        super.writeValue(dateValue);
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

}
