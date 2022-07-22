import {Component} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {get} from 'lodash';

@Component({
    selector: 'app-filter-grid-actions',
    templateUrl: './filter-grid-actions.component.html',
    styleUrls: ['./filter-grid-actions.component.scss']
})
export class FilterGridActionsComponent implements AgRendererComponent {

    private params: any;

    get actions() {
        return get(this, 'params.colDef.actions');
    }

    get data() {
        return get(this, 'params.data');
    }

    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
    }

    refresh(params) {
        return false;
    }

    handleAction(action) {
        if (action.callback) {
            action.callback(this.data, this.params);
        }
    }

    getClass(action) {
        return action.class && {[action.class]: true};
    }

    getIsActive(action) {
        let isActive: boolean;
        isActive = action.isActive;

        if (isActive === undefined) {
            return true
        } else {
            return isActive
        }
    }

}
