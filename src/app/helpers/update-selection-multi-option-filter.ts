import {IServerDropdownOption} from '../models/server-dropdown';

export const updateSelectionMultiOptionsFilter = (filters: IServerDropdownOption[], changedFilter: IServerDropdownOption) => {
    return filters.map(filter => {
        if (filter.value === changedFilter.value) {
            filter.selected = changedFilter.selected;
        }
        return filter;
    });
}
