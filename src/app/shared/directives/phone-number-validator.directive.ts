import {AbstractControl, ValidatorFn} from '@angular/forms';
import {CountryCode, isValidNumber} from 'libphonenumber-js';

export function phoneNumberValidator(countryCode: CountryCode = 'US'): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value) {
            return isValidNumber(control.value, countryCode) ? null : {notValid: true};
        } else {
            // do not validate if field is empty since it may not be a required field
            return null;
        }
    };
}
