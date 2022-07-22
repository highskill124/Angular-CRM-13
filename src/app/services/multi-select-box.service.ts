import { Injectable } from '@angular/core';
import {IOptionMultiSelectBox} from '../modules/multi-select-box/components/multi-select-box/multi-select-box.component';

@Injectable({providedIn: 'root'})
export class MultiSelectBoxService {
    private selectOptions: IOptionMultiSelectBox[];

    setSelectOptions(options: IOptionMultiSelectBox[]) {
        this.selectOptions = options;
    }

    getSelectOptions() {
        return this.selectOptions ? this.selectOptions : [];
    }
}
