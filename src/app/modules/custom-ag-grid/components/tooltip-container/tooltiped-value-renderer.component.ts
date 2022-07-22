import {Component, Input} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';

/*export interface IMultiKeyValueItemRendererAction {
    event;
    options: IServerDropdownOption[],
}*/

@Component({
    selector: 'app-tooltiped-value-renderer',
    templateUrl: './tooltiped-value-renderer.component.html',
    styleUrls: ['./tooltiped-value-renderer.component.scss']
})
export class TooltipedValueRendererComponent implements AgRendererComponent {

    params: any;
    tooltipContent = null;
    @Input() tooltipRenderer: Function;
    @Input() valueRenderer: Function;

    constructor() {
    }

    agInit(params: any): void {
        // console.log('params inside multi key value item renderer ', params);
        setTimeout(() => {
            if (params) {
                this.params = {...params};
                if (params.tooltipRenderer) {
                    this.tooltipRenderer = params.tooltipRenderer;
                    this.tooltipContent = params.value && this.tooltipRenderer(params.value);
                }
                if (params.valueRenderer) {
                    this.valueRenderer = params.valueRenderer;
                    // Call the passed in value renderer with the value
                    this.params.value = params.value && this.valueRenderer(params.value);
                }
            }
        }, 0);
    }

    refresh(params) {
        return false;
    }
}
