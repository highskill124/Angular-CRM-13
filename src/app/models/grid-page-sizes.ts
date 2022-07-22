import {IServerDropdownOption} from "./server-dropdown";

export const gridPageSizes: IServerDropdownOption[] = [
    {name: '25', value: 25, selected: true},
    {name: '50', value: 50, selected: false},
    {name: '100', value: 100, selected: false},
    {name: '250', value: 250, selected: false},
    {name: '1000', value: 1000, selected: false},
    {name: '3000', value: 3000, selected: false},
];

export const selectedGridPageSize: number = gridPageSizes.find(item => item.selected).value || gridPageSizes[0];
