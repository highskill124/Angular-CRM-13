import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {from, Observable} from 'rxjs';
import {ContactsService} from '../../../../services/contacts/contacts.service';
import {map, shareReplay, tap} from 'rxjs/operators';
import {IOptionMultiSelectBox} from '../../../../modules/multi-select-box/components/multi-select-box/multi-select-box.component';
import {ContactFilter} from '../../../../enums/contact-filter.enum';
import {TagService} from '../../../../services/tag.service'
import {BucketService} from '../../../../services/bucket.service'

export interface IFilterSelectionResult {
    [ContactFilter.TYPE]?: IServerDropdownOption;
    [ContactFilter.BUCKETS]?: IServerDropdownOption[];
    [ContactFilter.TAGS]?: IServerDropdownOption[];
}

@Component({
    selector: 'app-filters-sidebar',
    templateUrl: './filters-sidebar.component.html',
    styleUrls: ['./filters-sidebar.component.scss']
})
export class FiltersSidebarComponent implements OnInit {

    types: Array<IServerDropdownOption> = [
        {value: 'active', name: 'Active', selected: true},
        {value: 'archived', name: 'Archived', selected: false},
        {value: 'duplicate', name: 'Duplicate', selected: false},
    ];
    selectedFilters: IFilterSelectionResult = {};

    guids = DropdownGuids;
    contactFilters = ContactFilter;

    // Do not rename these three variables, they are generated elsewhere (ContactsListComponent) to match these names
    typeOptions$: Observable<Array<IServerDropdownOption>>;
    tagsOptions$: Observable<Array<IServerDropdownOption>>;
    bucketsOptions$: Observable<Array<IServerDropdownOption>>;

    @Output() filtersChanged = new EventEmitter<IFilterSelectionResult>();

    constructor(private contactsService: ContactsService,
        private bucketService: BucketService,
        private tagService: TagService) {
    }

    ngOnInit() {
        /**
         * shareReplay makes sure only one https request is made for options and re-emitted for new subscriptions
         * We update the selected filters after setting the observable in case filters are set from the server
         */
        // this.typeOptions$ = from([this.types]).pipe(
        //     shareReplay(),
        //     tap(options => {
        //         this.filterAndUpdateSelectedOptions(this.contactFilters.TYPE, options);
        //     })
        // );
        this.tagsOptions$ = this.tagService.tagList('Contact').pipe(
            shareReplay(),
            tap(options => {
                this.filterAndUpdateSelectedOptions(this.contactFilters.TAGS, options);
            })
        );
        this.bucketsOptions$ = this.bucketService.bucketList('Contact').pipe(
            shareReplay(),
            tap((options => {
                this.filterAndUpdateSelectedOptions(this.contactFilters.BUCKETS, options);
            }))
        );
    }

    /**
     * update the current selected options for this filter
     * if selected is an empty array still update given it means no tract is selected
     *
     * @param filter
     * @param options
     */
    filterAndUpdateSelectedOptions(filter: ContactFilter, options: IServerDropdownOption[]) {
        /*if (typeof options === 'object' && options !== null) {
            // single filter
        }*/
        const selected = options.filter(option => option.selected);
        this.updateSelectedFilters(filter, selected);
    }

    emitFiltersChanged(filters: IFilterSelectionResult) {
        this.filtersChanged.emit(filters);
    }

    /**
     * Using the observable name passed in, update it's match in the component by creating a new observable from the options
     * passed in applying the filter/change to the corresponding option
     * @param params
     */
    updateOptionSelection(params: {
        filter: ContactFilter,
        observableName: string,
        optionsList: Array<IServerDropdownOption>,
        changed: IOptionMultiSelectBox
    }) {
        this[params.observableName] = from([params.optionsList]).pipe(
            map(options => {

                // Since the type filter can only have one active filter at a time, check and make sure only one is set as selected
                if (params.filter === this.contactFilters.TYPE) {
                    return options.map(option => {
                        if (option.value === params.changed.value) {
                            option.selected = params.changed.selected;
                        } else {
                            option.selected = false;
                        }
                        return option;
                    });
                } else {
                    // this takes care of updating buckets, tags, etc
                    return options.map(option => {
                        if (option.value === params.changed.value) {
                            option.selected = params.changed.selected;
                        }
                        return option;
                    });
                }
            }),
            tap(options => {
                this.filterAndUpdateSelectedOptions(params.filter, options);
            })
        );
    }

    private setSelectedForFilter(filter: ContactFilter, selected: IServerDropdownOption[]) {
        if (filter === this.contactFilters.TYPE) {
            this.selectedFilters[filter] = selected[0];
        } else {
            this.selectedFilters[filter] = selected;
        }
    }

    private updateSelectedFilters(filter: ContactFilter, selected: IServerDropdownOption[]) {
        this.setSelectedForFilter(filter, selected);
        this.emitFiltersChanged(this.selectedFilters);
    }
}
