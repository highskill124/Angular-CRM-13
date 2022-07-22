import {Pipe, PipeTransform} from '@angular/core';
import {IServerDropdownOption} from '../../models/server-dropdown';

@Pipe({name: 'filter'})
export class EmailFilterPipe implements PipeTransform {
    /**
     * NB: Each item in the array of items passed must have a field called name for
     *      comparison of the input value and the item to work
     * @param items
     * @param inputVal
     */
    public transform(items: Partial<IServerDropdownOption[]>, inputVal) {
        if (items && items.length) {
            return items.filter((item) => item.name.startsWith(inputVal.toLowerCase()));
        } else {
            return items;
        }
    }
}
