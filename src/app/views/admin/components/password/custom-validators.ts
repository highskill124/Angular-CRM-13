import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static patternValidator(regex: RegExp, requiredTimes: number, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
      const value: string = control.value;
       // test the value of the control against the regexp supplied
      const valid =  ((value.match(regex) || []).length >= requiredTimes)
      console.log((value.match(regex) || []).length + ' - ' + requiredTimes )
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('newPassword').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      console.log('No mathch' + password + ' - ' + confirmPassword)
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    } else {
        control.get('confirmPassword').setErrors(null);
  }
}
}
