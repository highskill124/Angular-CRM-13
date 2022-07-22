import {Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators, } from '@angular/forms';
import {IServerDropdownOption} from '../../../models/server-dropdown';
import {IsRequiredValidator} from '../../directives/is-required-validator.directive';
import {
    ConnectedPositioningStrategy,
    IgxDropDownComponent,
    IgxInputDirective,
    IgxInputGroupComponent,
    ISelectionEventArgs
} from 'igniteui-angular';
import {BaseControlValueAccessor} from '../../BaseControlValueAccessor';
import {empty, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, takeWhile} from 'rxjs/operators';

@Component({
    selector: 'app-input-autocomplete-select',
    templateUrl: './input-autocomplete-select.component.html',
    styleUrls: ['./input-autocomplete-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputAutocompleteSelectComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => InputAutocompleteSelectComponent),
            multi: true,
        },
    ],
})
// base control value accessor generic type is an array of strings that represent the value of each chip
export class InputAutocompleteSelectComponent extends BaseControlValueAccessor<string> implements OnInit, OnDestroy {

    @Input() label: string;
    @Input() selectOptions: IServerDropdownOption[];
    @Input() isRequired = false;

    // private _disabled = false;

    form: FormGroup;
    validateFn: Function;

    @ViewChild('inputForm', {read: IgxInputDirective})
    public inputBox: IgxInputDirective;

    @ViewChild(IgxDropDownComponent)
    public igxDropDown: IgxDropDownComponent;

    @ViewChild('inputGroup', {read: IgxInputGroupComponent})
    public inputGroup: IgxInputGroupComponent;

    private dropDownOpened = false;

    private searchText$ = new Subject<string>();
    @Output() onQueryValue: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSelectionChange: EventEmitter<IServerDropdownOption> = new EventEmitter<IServerDropdownOption>();

    alive = true;
    @Input() set disabled(isDisabled: boolean) {
        this._disabled = isDisabled;
    }
    get disabled() {
        return this._disabled;
    }

    constructor(private fb: FormBuilder) {
        super();

        this.searchText$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((query: any) => {
                this.onQueryValue.emit(query);
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

    get selected() {
        return this.form.get('selected');
    }

    initForm() {
        this.form = this.fb.group({
            selected: [''],
        });

        if (this.isRequired) {
            this.selected.setValidators(Validators.required);
            this.selected.updateValueAndValidity();
            this.form.updateValueAndValidity();
        }

        this.form.valueChanges.subscribe(val => {
            this.onChange(val.selected);
            this.value = val.selected;
        });
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
        const selected = this.selectOptions.find(option => option.value === ev.newSelection.value);
        // emit selected value
        this.emitSelection(selected);

        this.selected.setValue(ev.newSelection.value);
        this.igxDropDown.close();
        this.inputBox.value = selected.name;
        this.inputBox.focus();
    }

    writeValue(chipValue: string) {
        super.writeValue(chipValue);
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

    onSearch(query: string = '') {
        this.searchText$.next(query);
    }

    clearSelected($event) {
        // emit empty value as selected value since selection is being changed
        // this.emitSelection(null);
        if (this.selected.value) {
            this.selected.setValue('');
        }
    }

    emitSelection(selection: IServerDropdownOption) {
        this.onSelectionChange.emit(selection);
    }
}
