import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {from, Observable} from 'rxjs';
import {map, shareReplay, tap} from 'rxjs/operators';
import {IOptionMultiSelectBox} from '../../../../modules/multi-select-box/components/multi-select-box/multi-select-box.component';
import {FarmsFilter} from '../../../../enums/farms-filter.enum';
import {FarmService} from '../../../../services/farm/farm.service';
import {EMPTY_STRING} from '../../../../models/empty-string';
import {IFarmsFilterResult} from '../../../../models/farm-filter-result';

@Component({
    selector: 'app-farms-list-filters-sidebar',
    templateUrl: './farms-list-filters-sidebar.component.html',
    styleUrls: ['./farms-list-filters-sidebar.component.scss']
})
export class FarmsListFiltersSidebarComponent implements OnInit, OnDestroy {

    selectedFilters: IFarmsFilterResult = {};

    guids = DropdownGuids;
    farmFilters = FarmsFilter;
    alive = true;

    ownerOccupiedOptions: Array<IServerDropdownOption> = [
        {value: EMPTY_STRING, name: 'No filter', selected: true},
        {value: 1, name: 'Yes', selected: false},
        {value: 0, name: 'No', selected: false},
    ];

    // Rename this variable with care, it is re-generated elsewhere (Grid component that uses this sidebar) to match this name
    tractsOptions$: Observable<Array<IServerDropdownOption>>;
    phoneOptions$: Observable<Array<IServerDropdownOption>>;
    emailOptions$: Observable<Array<IServerDropdownOption>>;
    ownerOptions$: Observable<Array<IServerDropdownOption>>;

    @Output() filtersChanged = new EventEmitter<IFarmsFilterResult>();

    constructor(private farmService: FarmService) {
    }

    ngOnInit() {
        this.tractsOptions$ = this.farmService.tractsList().pipe(
            shareReplay(),
            /*tap((options => {
              this.filterAndUpdateSelectedOptions(this.farmFilters.TRACTS, options);
            }))*/
        );

        this.phoneOptions$ = from([[
            {value: EMPTY_STRING, name: 'No filter', selected: true},
            {value: 1, name: 'Phone', selected: false},
            {value: 0, name: 'No Phone', selected: false},
        ]]);

        this.emailOptions$ = from([[
            {value: EMPTY_STRING, name: 'No filter', selected: true},
            {value: 1, name: 'Email', selected: false},
            {value: 0, name: 'No Email', selected: false},
        ]]);

        this.ownerOptions$ = from([this.ownerOccupiedOptions]);
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    /**
     * update the current selected options for this filter
     * if selected is an empty array still update given it means no tract is selected
     *
     * @param filter
     * @param options
     */
    filterAndUpdateSelectedOptions(filter: FarmsFilter, options: IServerDropdownOption[]) {
        const selected = options.filter(option => option.selected);

        this.updateSelectedFilters(filter, selected);
    }

    emitFiltersChanged(filters: IFarmsFilterResult) {
        this.filtersChanged.emit(filters);
    }

    /**
     * Using the observable name passed in, update it's match in the component by creating a new observable from the options
     * passed in applying the filter/change to the corresponding option
     * @param params
     */
    updateOptionSelection(params: {
        filter: FarmsFilter,
        optionWasRemoved?: boolean, // multiple means multiple options can be selected for the filter, while single means only one option can be selected at a time
        observableName: string,
        optionsList: Array<IServerDropdownOption>,
        changed: IOptionMultiSelectBox
    }) {
        this[params.observableName] = from([params.optionsList]).pipe(
            map(options => {
                if (this.isSingleOptionFilter(params.filter)) {
                    if (params.optionWasRemoved) {
                        return this.resetSelectionSingleOptionFilter(options);
                    } else {
                        return this.updateSelectionSingleOptionFilter(options, params.changed);
                    }
                }
                return this.updateSelectionMultiOptionsFilter(options, params.changed);
            }),
            tap(options => {
                /**
                 * TODO: Issue here as it triggers double requests when a filter is removed in the filters display above farm list grid
                 */
                this.filterAndUpdateSelectedOptions(params.filter, options);
            })
        );
    }

    resetSelectionSingleOptionFilter(options: IServerDropdownOption[]) {
        return options.map(option => {
            option.value === EMPTY_STRING ? option.selected = true : option.selected = false;
            return option;
        });
    }

    updateSelectionSingleOptionFilter(options: IServerDropdownOption[], changedOption: IServerDropdownOption) {
        return options.map(option => {
            // If it's a one item selected at a time filter, make sure to set the rest of the filters as not selected
            option.selected = option.value === changedOption.value;
            return option;
        });
    }

    updateSelectionMultiOptionsFilter(options: IServerDropdownOption[], changedOption: IServerDropdownOption) {
        return options.map(option => {
            if (option.value === changedOption.value) {
                option.selected = changedOption.selected;
            }
            return option;
        });
    }

    isSingleOptionFilter(filter: FarmsFilter) {
        return filter === FarmsFilter.PHONE ||
            filter === FarmsFilter.EMAIL ||
            filter === FarmsFilter.OWNER_OCCUPIED;

    }

    private setSelectedForFilter(filter: FarmsFilter, selected: IServerDropdownOption[]) {
        this.selectedFilters[filter] = selected.filter(option => option.selected);
    }

    private updateSelectedFilters(filter: FarmsFilter, selected: IServerDropdownOption[]) {
        this.setSelectedForFilter(filter, selected);
        console.log('setting selected for ', [filter, selected]);
        this.emitFiltersChanged(this.selectedFilters);
    }
}
