import { Component } from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {GridAction, IGridAction} from '../../../../models/grid';

@Component({
  selector: 'app-actions-renderer',
  templateUrl: './actions-renderer.component.html',
  styleUrls: ['./actions-renderer.component.scss']
})
export class ActionsRendererComponent implements AgRendererComponent {

    private params: any;
    actions: IGridAction[];
    gridActions = GridAction;

    constructor() { }

    agInit(params: any): void {
        this.params = params;
        // console.log(params);
        setTimeout(() => {
            if (params && params.data && params.data.actions) {
                this.actions = params.data.actions;
            }
        }, 10);
    }

    refresh(params) {
        return false;
    }

    onEdit(action: IGridAction) {
        this.params.context.componentParent.onEdit(this.params.data[action.idField]);
    }

    onDelete(action: IGridAction) {
        this.params.context.componentParent.onDelete(this.params.data[action.idField]);
    }

    onTracking(action: IGridAction) {
        this.params.context.componentParent.onTracking(this.params.data[action.idField]);
    }

    onView(action: IGridAction) {
       this.params.context.componentParent.onView(this.params);
    }
}
