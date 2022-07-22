import {Component, OnInit} from '@angular/core';
import { Actions, GridColumnDef, PageData, PlusActions } from '../../../../shared/models';


/****** old Imports **********/
// import {GridColumn} from '../../../../models/grid-column';
// import {IGridInput} from '../../../../models/grid';
// import {GridType} from '../../../../models/grid-types.enum';
// import {GridColumnsService} from '../../../../services/grid-columns.service';

@Component({
    selector: 'app-farm-lists-test',
    templateUrl: './farm-lists-test.component.html',
    styleUrls: ['./farm-lists-test.component.css']
})
export class FarmListsTestComponent implements OnInit {
    pageData: PageData =  new PageData()

    actionsColumns:Actions[] =[
        { icon: 'delete', color:'red', callback:(data?:any, param?:any) => { console.log(data); }},
    ]
    plusActions: PlusActions[] = [
        { icon: 'delete', type:'many', color:'red', callback:(data?:any, param?:any) => { console.log(data)}},
        { icon: 'edit', type:'one', color:'blue', callback:(data?:any, param?:any) => { console.log(data)}},
    ]

    contactsColums:GridColumnDef[] =[
        { header:"Name", dbNode:"Name" },
        { header:"Email", dbNode:"emails", type:'arrayShowWithkey' },
        { header:"Mobile", dbNode:"phones", type:'arrayShowWithkey' }
    ];
    toReloadNow: boolean;


    constructor() {
    }

    ngOnInit() {
    }

    printUpdatedData(event) {
        console.log('From Parent Component', event);
    }


    /*************** old-code below *******************/

    // public tableHeaders: GridColumn[];

    // gridInput: IGridInput = {
    //     title: 'Farms List',
    //     gridType: new GridType({guid: '43A4ED59-3515-4A19-B919-863D15A3DCBB', url: '/farms/list2'}),
    // };

    // constructor(private _columnsService: GridColumnsService) {
    // }

    // ngOnInit() {
    //     this._columnsService.fetchColumns(this.gridInput.gridType.guid)
    //         .subscribe(columns => {
    //                 this.tableHeaders = columns;
    //             }
    //         );
    // }

}
