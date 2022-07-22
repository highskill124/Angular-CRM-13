import {FarmsFilter} from '../enums/farms-filter.enum';
import {IServerDropdownOption} from './server-dropdown';

export interface IFarmsFilterResult {
    [FarmsFilter.TRACTS]?: IServerDropdownOption[];
}
