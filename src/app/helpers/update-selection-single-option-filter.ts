import {IServerDropdownOption} from '../models/server-dropdown';

export const updateSelectionSingleOptionFilter = (filters: IServerDropdownOption[], changedFilter: IServerDropdownOption) => {
    return filters.map(filter => {
        // make sure to set the rest of the filters as not selected
        filter.selected = filter.value === changedFilter.value;
        return filter;
    });
}
