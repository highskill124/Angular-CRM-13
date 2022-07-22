import {Component} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';

@Component({
    selector: 'app-html-renderer',
    templateUrl: './html-renderer.component.html',
    styleUrls: ['./html-renderer.component.scss']
})
export class HtmlRendererComponent implements AgRendererComponent {

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
