import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';
import {AsYouType} from 'libphonenumber-js';

@Directive({
    selector: '[appFormatPhoneNumber]',
})
export class FormatPhoneNumberDirective {

    @Output() formattedNumber: EventEmitter<string> = new EventEmitter<string>();

    constructor(private el: ElementRef) {
    }

    @HostListener('input', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        const input = event.target as HTMLInputElement;

        if (input.value) {
            // console.log(input.value);
            this.formattedNumber.next(new AsYouType('US').input(input.value));
        }
    }

}
