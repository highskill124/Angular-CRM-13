import {Component, OnInit} from '@angular/core';
import {IGridInput} from '../../../../models/grid';
import {GridColumn} from '../../../../models/grid-column';
import {GridType} from '../../../../models/grid-types.enum';
import {GridColumnsService} from '../../../../services/grid-columns.service';


@Component({
    selector: 'app-farm-lists',
    templateUrl: './farm-lists.component.html',
    styleUrls: ['./farm-lists.component.css']
})
export class FarmListsComponent implements OnInit {

    public tableHeaders: GridColumn[];

    gridInput: IGridInput = {
        title: 'Farms List',
        gridType: new GridType({guid: '43A4ED59-3515-4A19-B919-863D15A3DCBB', url: '/farms/list'}),
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
