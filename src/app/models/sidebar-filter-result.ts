import {IServerDropdownOption} from './server-dropdown';

export interface ISidebarFilter {
    name: string;
    value: IServerDropdownOption | IServerDropdownOption[];
}

export interface ISidebarFilterResult<T> {
    filters: Array<ISidebarFilter>
}
