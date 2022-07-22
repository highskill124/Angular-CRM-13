import { FilterOption } from './filter-option.model';

export interface FilterResponseData {
    enabled: boolean;
    fieldname: string;
    label: string;
    options: FilterOption[];
    order: number;
    type: 'single' | 'multi';
}
