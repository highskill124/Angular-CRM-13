/// <reference types="@types/googlemaps" />
import {Component, ElementRef, EventEmitter, forwardRef, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {Location} from '../entity/Location';
// import {} from '@types/googlemaps';
// import {} from 'googlemaps';
import {FormBuilder, FormControl, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';

declare var google: any;

@Component({
    selector: 'app-places-search',
    templateUrl: './places-search.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PlacesSearchComponent),
            multi: true,
        },
    ],
})
export class PlacesSearchComponent implements OnInit {

    form = this.fb.group({
        search: [''],
    });
    value;

    @Input() inputLabel = 'search for location';
    @Input() isRequired = false;

    private _disabled = false;

    @Output() positionChanged = new EventEmitter<Location>();
    @Output() addressObject = new EventEmitter<any>();

    @ViewChild('search')
    public searchElementRef: ElementRef;
    @Input() set disabled(isDisabled: boolean) {
        this._disabled = isDisabled;
    }
    get disabled() {
        return this._disabled;
    }

    onChange: any = () => {
    };
    onTouched: any = () => {
    };
    validateFn: any = () => {
    };

    constructor(private mapsAPILoader: MapsAPILoader,
                private fb: FormBuilder,
                private ngZone: NgZone) {
    }

   

    ngOnInit() {
        // load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address'],
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // get the place result
                    const place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    const formattedAddress = this.getFormattedAddress(place);
                    this.onInputChange(formattedAddress.formatted_address);
                    // Emit the new address object for the updated place
                    this.addressObject.emit(formattedAddress);

                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.positionChanged.emit(
                        new Location(place.geometry.location.lat(),
                            place.geometry.location.lng()));
                });
            });
        });
    }

    getFormattedAddress(place: google.maps.places.PlaceResult) {
        // @params: place - Google Autocomplete place object
        // @returns: location_obj - An address object in human readable format
        const location_obj: any = {};
        for (const i in place.address_components) {
            const item = place.address_components[i];

            location_obj['formatted_address'] = place.formatted_address;
            if (item['types'].indexOf('locality') > -1) {
                location_obj['locality'] = item['long_name']
            } else if (item['types'].indexOf('administrative_area_level_1') > -1) {
                location_obj['admin_area_l1'] = item['short_name']
            } else if (item['types'].indexOf('street_number') > -1) {
                location_obj['street_number'] = item['short_name']
            } else if (item['types'].indexOf('route') > -1) {
                location_obj['route'] = item['long_name']
            } else if (item['types'].indexOf('country') > -1) {
                location_obj['country'] = item['long_name']
            } else if (item['types'].indexOf('postal_code') > -1) {
                location_obj['postal_code'] = item['short_name']
            }

        }
        return location_obj;
    }

    writeValue(value) {
        this.value = value;
        this.form.get('search').setValue(this.value);
    }

    validate(c: FormControl) {
        if (this.isRequired) {
            return Validators.required;
        } else {
            return null;
        }
    }

    registerOnChange(fn: (value: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    onInputChange(value) {
        this.onChange(value);
    }
}
