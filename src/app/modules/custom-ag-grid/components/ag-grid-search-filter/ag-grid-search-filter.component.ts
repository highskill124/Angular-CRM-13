import {Component, Input, ViewChild} from '@angular/core';
import {AgGridBaseComponent} from '../ag-grid-base/ag-grid-base.component';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {DropdownComponent} from '../../../../shared/components/dropdown/dropdown.component';
import { FilterGridComponent } from '../../../../views/filter-grid/components/filter-grid/filter-grid.component';


export interface IAgGridSearchFilterResult {
    newValue?: string;
    qstype?: string;
    qsearch?: string;
    qtypeText: string;
    activeFilters? : any;
}

export interface OnSearchFilter {
    onSearchFilterChanged: (params: IAgGridSearchFilterResult) => void;
}

@Component({
    selector: 'app-ag-grid-search-filter',
    templateUrl: './ag-grid-search-filter.component.html',
    styleUrls: ['./ag-grid-search-filter.component.scss']
})
export class AgGridSearchFilterComponent {

    public qstype: string;
    public newValue: string;

    @ViewChild(DropdownComponent) Dropdown: DropdownComponent;

    @Input() agGridBase: AgGridBaseComponent;
    @Input() filterGrid : FilterGridComponent
    @Input() qstypeOptions: IServerDropdownOption[];

    constructor(

      
    ) {
        
    }

    onSearchFilter() {

        console.log({newValue: this.newValue, qstype: this.qstype})
        const filter = this.qstypeOptions.find(x => x.value === this.qstype);
        let text = '';
        if (filter) {
            text = filter.name;
        }
        this.filterGrid.onSearchFilterChanged({newValue: this.newValue, qstype: this.qstype, qtypeText: text});
    }

    onDropDownSelect(value: string) {
        this.qstype = value
    }

    reset() {
        this.Dropdown.initForm()
        this.qstype = null;
        this.newValue = null;
        this.onSearchFilter();
    }
}
