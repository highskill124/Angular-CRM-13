import {IServerDropdownOption} from '../server-dropdown';
import {EMPTY_STRING} from '../empty-string';

export const ownerOccupiedOptions: Array<IServerDropdownOption> = [
    {value: EMPTY_STRING, name: 'No filter', selected: true},
    {value: 1, name: 'Yes', selected: false},
    {value: 0, name: 'No', selected: false},
];
