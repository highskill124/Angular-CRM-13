import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'app-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrls: ['./checkbox-cell.component.scss']
})
export class CheckboxCellComponent implements ICellRendererAngularComp {

    public params: ICellRendererParams;

    constructor() { }

    agInit(params: ICellRendererParams): void {
        this.params = params;
    }

    refresh(params) {
        return true;
    }

    public onChange(event) {
        // this.params.data[this.params.colDef.field] = event.currentTarget.checked;
    }
}
