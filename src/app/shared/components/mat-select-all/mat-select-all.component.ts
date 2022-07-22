import {
    Component,  forwardRef,  Input,  OnInit,  AfterViewInit, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
  import {  AbstractControl,  ControlValueAccessor,  FormControl,  FormGroup,  NG_VALIDATORS,
    NG_VALUE_ACCESSOR,  Validators, } from '@angular/forms';
    import { MatSelect } from '@angular/material/select';
  import { MatOption } from '@angular/material/core';
  import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldControl } from '@angular/material/form-field';


  @Component({
    selector: 'app-mat-select-all',
    templateUrl: './mat-select-all.component.html',
    styleUrls: ['./mat-select-all.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MatSelectAllComponent),
        multi: true,
      },
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => MatSelectAllComponent),
        multi: true,
      },
      {provide: MatFormFieldControl, useExisting: MatSelectAllComponent}
    ],
  })
  export class MatSelectAllComponent implements ControlValueAccessor, OnInit, AfterViewInit {

    @Input() isRequired = false;
    @Input() multiSelect = true;
    @Input() data: any[];
    @Input() fieldName: string;
    @Input() idField: string;
    @Input() labelText: string;
    @Input() multiselect = false
    @Input() text = 'Select All';


    @ViewChild('select') select: MatSelect;

    private _disabled = false;

    allSelected = false;
    value;
    selectField;
    form: FormGroup;
    onChange: Function;
    onTouched: Function;
    validateFn: Function;


    constructor() {}
    ngAfterViewInit() {

    }

    registerOnChange(fn: (value: any) => void) {
      this.onChange = fn;
    }

    isIndeterminate(): boolean {

      return this.selectField.value.length !== 0 &&
      this.selectField.value.length < this.data.length
    }

    isChecked(): boolean {
      return this.selectField.value && this.data.length
        && this.selectField.value.length === this.data.length;
    }

    ngOnInit() {
      this.selectField = new FormControl(this.value, []);
      this.form = new FormGroup({
        selectField: this.selectField,
      });

      if (this.isRequired) {
        this.form.get('selectField').setValidators(Validators.required);
        this.form.get('selectField').updateValueAndValidity();
        this.form.updateValueAndValidity();
      }

      this.form.valueChanges.subscribe((formData) => {
        this.onChange(formData.selectField);
        this.value = formData.selectField;
      });
    }

    writeValue(value) {
      this.value = value;
      this.form.get('selectField').setValue(this.value, { emitEvent: false });
    }

    validate(c: FormControl) {
      // return this.validateFn(c);
    }

    registerOnTouched(fn: () => void) {
      this.onTouched = fn;
    }



    toggleAllSelection(change: MatCheckboxChange): void {
      if (change.checked) {
        this.select.options.forEach((item: MatOption) => item.select());
      } else {
        this.select.options.forEach((item: MatOption) => item.deselect());
      }
    }


    }

