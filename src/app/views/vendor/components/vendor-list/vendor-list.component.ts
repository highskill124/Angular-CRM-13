import {Component, OnInit} from '@angular/core';
import {GridType} from '../../../../models/grid-types.enum';
import {GridColumnsService} from '../../../../services/grid-columns.service';
import {GridColumn} from '../../../../models/grid-column';
import {GridAction, IGridInput} from '../../../../models/grid';

@Component({
    selector: 'app-vendor-list',
    templateUrl: './vendor-list.component.html',
    styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent implements OnInit {

    public tableHeaders: GridColumn[];

    gridInput: IGridInput = {
        title: 'Vendor List',
        gridType: new GridType({guid: 'F828F072-A321-4F99-80B3-01A702AB0B92', url: '/vendor/list'}),
        actions: [
            {
                action: GridAction.EDIT,
                url: '/Vendor/Update',
                idField: 'VendorID'
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
