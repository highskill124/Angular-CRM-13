import {AbstractControl, ValidatorFn} from '@angular/forms';

export function IsRequiredValidator(isRequired = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

        // use array syntax to dynamically set the key (passed above as errorName) of the returned error object
        if (isRequired && (control.value == null || control.value === '')) {
            return {'isRequired': true};
        }

        return null;
    };
}
