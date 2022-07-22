import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Actions, GridColumnDef, PageData, PlusActions } from '../../shared/models';

@Component({
    selector: 'app-mat-new-grid',
    templateUrl: './mat-new-grid.component.html',
    styleUrls: ['./mat-new-grid.component.scss']
})
export class MatNewGridComponent implements OnInit {
    iconColor:any = '#000';
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
    
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    printUpdatedData(event) {
        console.log('From Parent Component', event);
    }

    ngOnInit() {
    }
}
