import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators, } from '@angular/forms';
import {IServerDropdownOption, ServerDropdownOption} from '../../../models/server-dropdown';
import {IsRequiredValidator} from '../../directives/is-required-validator.directive';
import {IgxChipsAreaComponent} from 'igniteui-angular';
import {
    IOptionMultiSelectBox,
    MultiSelectBoxComponent
} from '../../../modules/multi-select-box/components/multi-select-box/multi-select-box.component';
import {BaseControlValueAccessor} from '../../BaseControlValueAccessor';

@Component({
    selector: 'app-chips-select',
    templateUrl: './chips-select.component.html',
    styleUrls: ['./chips-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ChipsSelectComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ChipsSelectComponent),
            multi: true,
        },
    ],
})
// base control value accessor generic type is an array of strings that represent the value of each chip
export class ChipsSelectComponent extends BaseControlValueAccessor<string[]> implements OnInit {

    @Input() selectOptions: IServerDropdownOption[];
    @Input() title;
    // name of material icon to the left of the title
    @Input() classNames: string;
    @Input() titleIcon;
    @Input() isRequired = false;
    @Input() chipIsRemovable = true;
    @Input() actionButtonText = 'Add';

    // private _disabled = false;

    form: FormGroup;
    validateFn: Function;

    @ViewChild('chipsArea', {read: IgxChipsAreaComponent})
    public chipsArea: IgxChipsAreaComponent;

    @ViewChild('multiSelectBox', {read: MultiSelectBoxComponent})
    public multiSelectBox: MultiSelectBoxComponent;
    @Input() set disabled(isDisabled: boolean) {
        this._disabled = isDisabled;
    }
    get disabled() {
        return this._disabled;
    }

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.validateFn = IsRequiredValidator(this.isRequired);
        this.initForm();
    }

    get chips() {
        return this.form.get('chips') as FormArray;
    }

    initForm() {
        this.form = this.fb.group({
            chips: this.fb.array([]),
        });

        if (this.isRequired) {
            this.chips.setValidators(Validators.required);
            this.chips.updateValueAndValidity();
            this.form.updateValueAndValidity();
        }

        this.form.valueChanges.subscribe(val => {
            this.onChange(val.chips);
            this.value = val.chips;
        });
    }

    /**
     * Add control with value passed in to FormArray passed in
     * @param controlValue
     * @param formArray
     */
    addFormArrayControl(controlValue, formArray: FormArray) {
        formArray.push(this.fb.control(controlValue));
        this.chipsArea.cdr.detectChanges();
    }

    /**
     * Find option with value equal value passed and set it as selected
     * @param value
     */
    setCorrespondingOptionSelected(value: string) {
        this.selectOptions = this.selectOptions.map(option => {
            if (option.value === value) {
                option.selected = true;
            }
            return option;
        });
    }

    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    /**
     * Clear current chips and create new ones for each selected option from the multi select box
     * @param options: IOptionMultiSelectBox
     */
    syncFormArray(options: IOptionMultiSelectBox[]) {
        this.clearFormArray(this.chips);
        options.forEach(option => {
            if (option.selected) {
                this.addFormArrayControl(option.value, this.chips);
            }
        });
        //TODO: Remove Debug Console LOG
        console.log(this.chips.value)
    }

    optionDetails(optionValue: string, options: ServerDropdownOption[]) {
        return options.find(option => option.value === optionValue);
    }

    removeChipControl(controlValue, optionsToUpdate?: IServerDropdownOption[]) {
        this.chips.removeAt(
            this.chips.value.findIndex(item => item === controlValue)
        );
        this.chipsArea.cdr.detectChanges();
        if (optionsToUpdate && optionsToUpdate.length) {
            optionsToUpdate = [...optionsToUpdate.map(option => {
                option.selected = option.value === controlValue ? false : option.selected;
                return option;
            })];
        }
    }

    writeValue(chipValues: string[]) {
        super.writeValue(chipValues);

        this.clearFormArray(this.chips);
        if (chipValues && chipValues.length) {
            chipValues.forEach(chipValue => {
                this.chips.push(this.fb.control(chipValue));
                this.setCorrespondingOptionSelected(chipValue);
            });
        }
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }
}
