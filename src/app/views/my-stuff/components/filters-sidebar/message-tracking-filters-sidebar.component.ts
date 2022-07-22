import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {from, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {IOptionMultiSelectBox} from '../../../../modules/multi-select-box/components/multi-select-box/multi-select-box.component';
import {MessageTrackingFilter} from '../../../../enums/message-tracking-filter.enum';
import {MessageTrackingService} from '../../../../services/message-tracking.service';

export interface IMessageTrackingFilterResult {
    [MessageTrackingFilter.TRACTS]?: IServerDropdownOption[];
}

@Component({
    selector: 'app-message-tracking-filters-sidebar',
    templateUrl: './message-tracking-filters-sidebar.component.html',
    styleUrls: ['./message-tracking-filters-sidebar.component.scss']
})
export class MessageTrackingFiltersSidebarComponent implements OnInit {

    selectedFilters: IMessageTrackingFilterResult = {};

    guids = DropdownGuids;
    filters = MessageTrackingFilter;

    // Rename this variable with care, it is re-generated elsewhere (MessageTrackingGridComponent) to match this name
    tractsOptions$: Observable<Array<IServerDropdownOption>>;

    @Output() filtersChanged = new EventEmitter<IMessageTrackingFilterResult>();

    constructor(private messageTrackingService: MessageTrackingService) {
    }

    ngOnInit() {
        /*this.tractsOptions$ = this.messageTrackingService.tractsList().pipe(
            shareReplay(),
            tap((options => {
              this.filterAndUpdateSelectedOptions(this.filters.TRACTS, options);
            }))
            );*/
    }

    /**
     * update the current selected options for this filter
     * if selected is an empty array still update given it means no tract is selected
     *
     * @param filter
     * @param options
     */
    filterAndUpdateSelectedOptions(filter: MessageTrackingFilter, options: IServerDropdownOption[]) {
        const selected = options.filter(option => option.selected);

        this.updateSelectedFilters(filter, selected);
    }

    emitFiltersChanged(filters: IMessageTrackingFilterResult) {
        this.filtersChanged.emit(filters);
    }

    /**
     * Using the observable name passed in, update it's match in the component by creating a new observable from the options
     * passed in applying the filter/change to the corresponding option
     * @param params
     */
    updateOptionSelection(params: {
        filter: MessageTrackingFilter,
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

    private setSelectedForFilter(filter: MessageTrackingFilter, selected: IServerDropdownOption[]) {
        this.selectedFilters[filter] = selected.filter(option => option.selected);
    }

    private updateSelectedFilters(filter: MessageTrackingFilter, selected: IServerDropdownOption[]) {
        this.setSelectedForFilter(filter, selected);
        this.emitFiltersChanged(this.selectedFilters);
    }
}
