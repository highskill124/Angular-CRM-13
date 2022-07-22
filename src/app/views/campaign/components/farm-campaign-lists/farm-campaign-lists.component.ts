import {Component, OnInit} from '@angular/core';
import {GridType} from '../../../../models/grid-types.enum';
import {GridColumnsService} from '../../../../services/grid-columns.service';
import {GridColumn} from '../../../../models/grid-column';
import {GridAction, IGridInput} from '../../../../models/grid';

@Component({
    selector: 'app-farm-campaign-lists',
    templateUrl: './farm-campaign-lists.component.html',
    styleUrls: ['./farm-campaign-lists.component.css']
})
export class FarmCampaignListsComponent implements OnInit {

    public tableHeaders: GridColumn[];

    gridInput: IGridInput = {
        title: 'Farms Campaign List',
        gridType: new GridType({guid: 'F828F072-A321-4F99-80B3-01A702AB0B92', url: '/campaign/list'}),
        actions: [
            {
                action: GridAction.EDIT,
                url: '/Farm/CampaignLink1/Update',
                idField: 'CampaignID'
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
