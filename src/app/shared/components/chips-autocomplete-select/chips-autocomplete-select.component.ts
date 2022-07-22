import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators, } from '@angular/forms';
import {IServerDropdownOption, ServerDropdownOption} from '../../../models/server-dropdown';
import {IsRequiredValidator} from '../../directives/is-required-validator.directive';
import {
    ConnectedPositioningStrategy,
    IgxChipsAreaComponent,
    IgxDropDownComponent,
    IgxInputDirective,
    IgxInputGroupComponent,
    IgxToggleDirective,
    ISelectionEventArgs
} from 'igniteui-angular';
import {BaseControlValueAccessor} from '../../BaseControlValueAccessor';
import {empty, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, takeWhile} from 'rxjs/operators';

@Component({
    selector: 'app-chips-autocomplete-select',
    templateUrl: './chips-autocomplete-select.component.html',
    styleUrls: ['./chips-autocomplete-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ChipsAutocompleteSelectComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ChipsAutocompleteSelectComponent),
            multi: true,
        },
    ],
})
// base control value accessor generic type is an array of strings that represent the value of each chip
/**
 * TODO: Currently this is designed to work specifically with emails, so use only for email controls
 */
export class ChipsAutocompleteSelectComponent extends BaseControlValueAccessor<string[]> implements OnInit, OnDestroy {

    @Input() label: string;
    @Input() classNames: string;
    @Input() selectOptions: IServerDropdownOption[];
    @Input() suffixTemplate: TemplateRef<any>;
    @Input() isRequired = false;

    // private _disabled = false;

    form: FormGroup;
    validateFn: Function;

    @ViewChild('chipsArea', {read: IgxChipsAreaComponent})
    public chipsArea: IgxChipsAreaComponent;

    @ViewChild('inputForm', {read: IgxInputDirective})
    public inputBox: IgxInputDirective;

    @ViewChild(IgxDropDownComponent)
    public igxDropDown: IgxDropDownComponent;

    @ViewChild('inputGroup', {read: IgxInputGroupComponent})
    public inputGroup: IgxInputGroupComponent;

    @ViewChild('toggleDirectiveMenu') public toggleDirectiveMenu: IgxToggleDirective;

    private dropDownOpened = false;

    private searchText$ = new Subject<string>();
    @Output() queryValue: EventEmitter<string> = new EventEmitter<string>();
    @Output() noMatchValue: EventEmitter<string> = new EventEmitter<string>();

    alive = true;
    @Input() set disabled(isDisabled: boolean) {
        this._disabled = isDisabled;
    }
    get disabled() {
        return this._disabled;
    }

    constructor(private fb: FormBuilder, public cdr: ChangeDetectorRef) {
        super();

        this.searchText$.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((query: any) => {
                this.queryValue.emit(query);
                return query || empty();
            }),
            takeWhile(() => this.alive),
        ).subscribe(res => {
            //
        });
    }

    ngOnInit() {
        this.validateFn = IsRequiredValidator(this.isRequired);
        this.initForm();
    }

    ngOnDestroy() {
        this.alive = false;
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

    addFormArrayControl(controlValue, formArray: FormArray) {
        formArray.push(this.fb.control(controlValue));
        this.chipsArea.cdr.detectChanges();
    }

    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    optionDisplayValue(optionValue: string, options: ServerDropdownOption[]) {
        if (options && options.length) {
            const current = options.find(option => option.value === optionValue);
            if (current) {
                if (current.name) {
                    return current.name;
                } else {
                    return current.value;
                }
            } else {
                return optionValue;
            }
        } else {
            return optionValue;
        }
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

    public toggleDropDown(ev) {
        if (!this.dropDownOpened && this.inputBox.value !== null && ev.key.length === 1) {
            this.igxDropDown.open({
                modal: false,
                positionStrategy: new ConnectedPositioningStrategy({
                    target: this.inputBox.nativeElement
                })
            });
            this.inputBox.focus();
        }
    }

    public clickedOutside(e) {
        this.igxDropDown.close();
    }

    public addEmail() {
        if (this.inputBox.valid === 1) {
            // let i;
            const inputBoxValue = this.inputBox.value.toLowerCase();
            let optionMatched = this.selectOptions && this.selectOptions.find(option => {
                return option.name === inputBoxValue
            });

            if (!(optionMatched && optionMatched.name)) {
                /**
                 * This means the value/email entered by the user is not found in the selectOptions
                 * array. So we can emit this value here and the parent will pick it up and do whatever
                 * follow up has to be done.
                 * We however still go ahead to add it as a chip
                 */
                this.noMatchValue.emit(inputBoxValue);
                optionMatched = {name: inputBoxValue, value: inputBoxValue, selected: null};
            }

            if (
                this.chips.value.findIndex(
                    (val) => val === optionMatched.value
                ) !== -1
            ) {
                return;
            }

            this.addFormArrayControl(optionMatched.value, this.chips);
            this.igxDropDown.close();
            this.inputBox.value = '';
            this.igxDropDown.close();
            this.inputBox.focus();
            this.inputBox.value = '';
        }
    }

    public openDropDown() {
        if (this.dropDownOpened) {
            return;
        }

        this.igxDropDown.open({
            modal: false,
            positionStrategy: new ConnectedPositioningStrategy({
                target: this.inputGroup.element.nativeElement
            })
        });
    }

    public onDropDownOpen() {
        this.dropDownOpened = true;
    }

    public onDropDownClose() {
        this.dropDownOpened = false;
    }

    public itemSelection(ev: ISelectionEventArgs) {
        //   this.chips.controls.findIndex()
        if (
            this.chips.value.findIndex(
                (val) => val === ev.newSelection.value
            ) !== -1
        ) {
            this.inputBox.focus();
            return;
        }
        let i;
        for (i = 0; i < this.selectOptions.length; i++) {
            if (
                ev.newSelection.value ===
                this.selectOptions[i].value
            ) {
                this.addFormArrayControl(ev.newSelection.value, this.chips);
                this.igxDropDown.close();
                this.inputBox.value = '';
                this.inputBox.focus();
            }
        }

        ev.cancel = true;
        this.toggleDirectiveMenu.close();
    }

    writeValue(chipValues: string[]) {
        super.writeValue(chipValues);

        this.clearFormArray(this.chips);
        if (chipValues && chipValues.length) {
            chipValues.forEach(chipValue => this.chips.push(this.fb.control(chipValue)));
        }
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

    onSearch(query: string = '') {
        this.searchText$.next(query);
    }
}
