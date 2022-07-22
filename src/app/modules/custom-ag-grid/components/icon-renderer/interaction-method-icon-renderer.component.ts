import {Component} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';

@Component({
    selector: 'app-interaction-method-icon-renderer',
    templateUrl: './interaction-method-icon-renderer.component.html',
    styleUrls: ['./interaction-method-icon-renderer.component.scss']
})
export class InteractionMethodIconRendererComponent implements AgRendererComponent {

    params: any;

    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
    }

    refresh(params) {
        return false;
    }

}
