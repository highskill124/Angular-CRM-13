import {
    Component,  forwardRef,  Input,  OnInit,  AfterViewInit} from '@angular/core';
  import {  AbstractControl,  ControlValueAccessor,  FormControl,  FormGroup,  NG_VALIDATORS,
    NG_VALUE_ACCESSOR,  Validators,} from '@angular/forms';
  import { Button } from '../../../models/button';
  
  @Component({
    selector: 'app-button-toggle',
    templateUrl: './button-toggle.component.html',
    styleUrls: ['./button-toggle.component.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ButtonToggleComponent),
        multi: true,
      },
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => ButtonToggleComponent),
        multi: true,
      },
    ],
  })
  export class ButtonToggleComponent
    implements ControlValueAccessor, OnInit, AfterViewInit
  {
    @Input() guid: string;
    @Input() isRequired = false;
    @Input() multiSelect = true;
    @Input() vertical = false;
  
    private _disabled = false;
  
    value;
    selectField;
    form: FormGroup;
    onChange: Function;
    onTouched: Function;
    validateFn: Function;
    @Input() trackOptions: Button[];
  
    constructor() {}
    ngAfterViewInit() {
      this.getInitialChecked();
    }
  
    registerOnChange(fn: (value: any) => void) {
      this.onChange = fn;
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
    // this.form.get('selectField').setValue(this.value);
      this.form.get('selectField').setValue(this.value, { emitEvent: false });
    }
  
    validate(c: FormControl) {
      // return this.validateFn(c);
    }
  
    registerOnTouched(fn: () => void) {
      this.onTouched = fn;
    }
    onValChange(e: number, b: boolean) {
      if (b === true) {
          this.setCheckedButton(e);
     
      } else {
        this.setUncheckedButton(e);
      }
    }
  
  
    private getCheckedButton(): number[] {
      const allCheckeBtn = this.trackOptions.filter((btn) => btn?.selected);
      const checkedArray = allCheckeBtn.map((btn) => btn.id);
      this.form.get('selectField').setValue(checkedArray);
      return checkedArray;
    }
  
  
    private getSingleCheckedButton(id: number): void {
      // Get all Checked Items which should be only one
      const allCheckeBtn = this.trackOptions.filter((btn) => btn?.selected);
      // Uncheck any checked Bttn
      allCheckeBtn.forEach(obj => { obj.selected = false });
      // Find the Button based on Id and check it
      const selectedBtn = this.trackOptions.find((btn) => btn.id === id);
      selectedBtn.selected = true;
      // Update the Controle value with new Checked ID
      this.form.get('selectField').setValue(id);
     
    }
  
    private isBtnChecked(id: number): boolean {
      const selectedBtn = this.trackOptions.find((btn) => btn.id === id);
      return selectedBtn.selected ? true : false;
    }
  
    setCheckedButton(id: number): void {
      // check if its multi or single select
      if (this.multiSelect === true) {
        const selectedBtn = this.trackOptions.find((btn) => btn.id === id);
        selectedBtn.selected = true;
        this.getCheckedButton();
      } else {
        const selectedBtn = this.trackOptions.find((btn) => btn.id === id);
        selectedBtn.selected = true;
        this.getSingleCheckedButton(id)
      }
    }
  
    enableCheckButton(id:number) {
      const selectedBtn = this.trackOptions.find((btn) => btn.id === id);
      selectedBtn.togglable = true;
  
    }
  
    disableCheckButton(id:number) {
      const selectedBtn = this.trackOptions.find((btn) => btn.id === id);
      selectedBtn.togglable = false;
    }
  
    private setUncheckedButton(id: number): void {
      const selectedBtn = this.trackOptions.find((btn) => btn.id === id);
      selectedBtn.selected = false;
      this.getCheckedButton();
    }
  
    checkifChecked() {
      const check = this.isBtnChecked(1);
      console.log('Is checked : ' + check);
    }
  
    getAllChecked() {
      const check = this.getCheckedButton();
      console.log(check);
    }
  
    setChecked(id: number) {
      this.setCheckedButton(id);
    }
    setUnchecked(id: number) {
      this.setUncheckedButton(id);
    }
  
    getInitialChecked() {
      if (this.multiSelect === true) {
      this.getCheckedButton();
      } else {
        const allCheckeBtn = this.trackOptions.filter((btn) => btn?.selected);
        const checkedArray = allCheckeBtn.map((btn) => btn.id);
        this.form.get('selectField').setValue(checkedArray[0]);
        console.log(allCheckeBtn)
  
      
  
      }
    }
  }
  