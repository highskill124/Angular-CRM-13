import {FilterOption} from './filter-option.model';

export interface FilterSetting {
    label: string;
    group: string;
    type: 'single' | 'multi';
    filters: FilterOption[];
    resetFiltersFunc?: any;
}
