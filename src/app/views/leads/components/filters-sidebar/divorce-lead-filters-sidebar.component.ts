import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {from, Observable} from 'rxjs';
import {map, shareReplay, tap} from 'rxjs/operators';
import {IOptionMultiSelectBox} from '../../../../modules/multi-select-box/components/multi-select-box/multi-select-box.component';
import {DivorceLeadService} from '../../../../services/divorce-lead.service';
import {DivorceLeadFilter} from '../../../../enums/divorce-lead.filter';

export interface IDivorceLeadFilterResult {
    city?: IServerDropdownOption[];
}

@Component({
    selector: 'app-divorce-lead-filters-sidebar',
    templateUrl: './divorce-lead-filters-sidebar.component.html',
    styleUrls: ['./divorce-lead-filters-sidebar.component.scss']
})
export class DivorceLeadFiltersSidebarComponent implements OnInit {

    selectedFilters: IDivorceLeadFilterResult = {};

    filters = DivorceLeadFilter;

    // Rename this variable with care, it is re-generated elsewhere (DivorceLeadsComponent) to match this name
    cityOptions$: Observable<Array<IServerDropdownOption>>;

    @Output() filtersChanged = new EventEmitter<IDivorceLeadFilterResult>();

    constructor(private divorceLeadService: DivorceLeadService) {
    }

    ngOnInit() {
        this.cityOptions$ = this.divorceLeadService.cityOptions().pipe(
            shareReplay(),
            tap((options => {
                this.filterAndUpdateSelectedOptions(this.filters.CITY, options);
            })),
        );
    }

    /**
     * update the current selected options for this filter
     * if selected is an empty array still update given it means no tract is selected
     *
     * @param filter
     * @param options
     */
    filterAndUpdateSelectedOptions(filter: DivorceLeadFilter, options: IServerDropdownOption[]) {
        const selected = options.filter(option => option.selected);

        this.updateSelectedFilters(filter, selected);
    }

    emitFiltersChanged(filters: IDivorceLeadFilterResult) {
        this.filtersChanged.emit(filters);
    }

    /**
     * Using the observable name passed in, update it's match in the component by creating a new observable from the options
     * passed in applying the filter/change to the corresponding option
     * @param params
     */
    updateOptionSelection(params: {
        filter: DivorceLeadFilter,
        observableName: string,
        optionsList: Array<IServerDropdownOption>,
        changed: IOptionMultiSelectBox
    }) {
        this[params.observableName] = from([params.optionsList]).pipe(
            map(options => {
                return options.map(option => {
                    if (option.value === params.changed.value) {
                        option.selected = params.changed.selected;
                    }
                    return option;
                });
            }),
            tap(options => {
                this.filterAndUpdateSelectedOptions(params.filter, options);
            })
        );
    }

    private setSelectedForFilter(filter: DivorceLeadFilter, selected: IServerDropdownOption[]) {
        this.selectedFilters[filter] = selected.filter(option => option.selected);
    }

    private updateSelectedFilters(filter: DivorceLeadFilter, selected: IServerDropdownOption[]) {
        this.setSelectedForFilter(filter, selected);
        this.emitFiltersChanged(this.selectedFilters);
    }
}
