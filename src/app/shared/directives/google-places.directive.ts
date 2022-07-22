/// <reference types="@types/googlemaps" />
import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {MapsAPILoader} from '@agm/core';

@Directive({
    selector: '[googlePlace]',
})
export class GooglePlacesDirective implements OnInit {
    @Input() isEnterBlocked = true;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    private element: HTMLInputElement;

    constructor(elRef: ElementRef, private mapsAPILoader: MapsAPILoader) {
        // elRef will get a reference to the element where the directive is placed
        this.element = elRef.nativeElement;
    }

    @HostListener('keydown.enter', ['$event'])
    enterEvent(event) {
        if (this.isEnterBlocked) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    getFormattedAddress(place) {
        // @params: place - Google Autocomplete place object
        // @returns: location_obj - An address object in human readable format
        const location_obj = {};
        for (const i in place.address_components) {
            const item = place.address_components[i];

            location_obj['formatted_address'] = place.formatted_address;
            if (item['types'].indexOf('locality') > -1) {
                location_obj['locality'] = item['long_name'];
            } else if (item['types'].indexOf('administrative_area_level_1') > -1) {
                location_obj['admin_area_l1'] = item['short_name'];
            } else if (item['types'].indexOf('street_number') > -1) {
                location_obj['street_number'] = item['short_name'];
            } else if (item['types'].indexOf('route') > -1) {
                location_obj['route'] = item['long_name'];
            } else if (item['types'].indexOf('country') > -1) {
                location_obj['country'] = item['long_name'];
                location_obj['country_short'] = item['short_name'];
            } else if (item['types'].indexOf('postal_code') > -1) {
                location_obj['postal_code'] = item['short_name'];
            }

        }
        return location_obj;
    }

    ngOnInit() {
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.element);
            // Event listener to monitor place changes in the input
            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                // Emit the new address object for the updated place
                this.onSelect.emit(this.getFormattedAddress(autocomplete.getPlace()));
            });
        });
    }

}
