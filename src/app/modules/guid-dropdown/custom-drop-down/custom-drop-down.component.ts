import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {Observable} from 'rxjs';
import {CustomDropdownService} from './custom-dropdown.service';
import {IServerDropdownOption, ServerDropdownOption} from '../../../models/server-dropdown';

export function customDropdownValidator(isRequired = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

        // use array syntax to dynamically set the key (passed above as errorName) of the returned error object
        if (isRequired && (control.value == null || control.value === '')) {
            return {'isRequired': true};
        }

        return null;
    };
}

@Component({
    selector: 'app-custom-dropdown',
    templateUrl: './custom-drop-down.component.html',
    styleUrls: ['./custom-drop-down.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomDropDownComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => CustomDropDownComponent),
            multi: true,
        },
    ],
})

/**
 * Main inputs are options array and guid
 * Guid is checked first and if available it's used to fill select options
 */
export class CustomDropDownComponent implements OnInit, ControlValueAccessor {

    @Input() guid: string;
    @Input() options: IServerDropdownOption[];
    @Input() placeholder = '--Select--';
    @Input() isRequired = false;

    private _disabled = false;

    options$: Observable<Array<ServerDropdownOption>>;
    value;
    selectField;
    form: FormGroup;
    onChange;
    onTouched;
    validateFn: Function;
    @Input() set disabled(isDisabled: boolean) {
        this._disabled = isDisabled;
    }
    get disabled() {
        return this._disabled;
    }


    constructor(private dropDownService: CustomDropdownService) {
    }

    ngOnInit() {
        this.validateFn = customDropdownValidator(this.isRequired);
        // console.log('passed in guid', this.guid);
        this.options$ = this.dropDownService.fetchData(this.guid);

        this.selectField = new FormControl(
            this.value, [],
        );

        this.form = new FormGroup({
            selectField: this.selectField,
        });
        if (this.isRequired) {
            this.form.get('selectField').setValidators(Validators.required);
            this.form.get('selectField').updateValueAndValidity();
            this.form.updateValueAndValidity();
        }
    }

    writeValue(value) {
        this.value = value;
        this.form.get('selectField').setValue(this.value);
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

    registerOnChange(fn: (value: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    onInputChange(value) {
        this.onChange(value);
    }
}
