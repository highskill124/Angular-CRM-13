import {Component, OnInit} from '@angular/core';
import {GridType} from '../../../../models/grid-types.enum';
import {GridColumnsService} from '../../../../services/grid-columns.service';
import {GridColumn} from '../../../../models/grid-column';
import {GridAction, IGridInput} from '../../../../models/grid';

@Component({
    selector: 'app-lead-lists',
    templateUrl: './lead-lists.component.html',
    styleUrls: ['./lead-lists.component.css']
})
export class LeadListsComponent implements OnInit {

    public tableHeaders: GridColumn[];

    gridInput: IGridInput = {
        title: 'Leads List',
        gridType: new GridType({guid: '05F6490D-C125-406E-8292-252BE7388CD6', url: '/leads/list'}),
        /*searchFields: [
          {name: 'name', placeholderText: 'Name', value: ''},
          {name: 'phone', placeholderText: 'Phone', value: ''},
          {name: 'email', placeholderText: 'Email', value: ''},
          {name: 'city', placeholderText: 'City', value: ''},
        ],*/
        actions: [
            {
                action: GridAction.EDIT,
                url: '/Leads/Update',
                idField: 'lead_id'
            }
        ],
    };

    constructor(private _columnsService: GridColumnsService) {
    }

    ngOnInit() {
        this._columnsService.fetchColumns(this.gridInput.gridType.guid)
            .subscribe(columns => {
                    this.tableHeaders = columns;
                }
            );
    }

}
