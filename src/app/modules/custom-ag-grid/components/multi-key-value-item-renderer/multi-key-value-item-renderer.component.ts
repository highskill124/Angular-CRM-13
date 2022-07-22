import {Component, Input} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {IServerDropdownOption} from '../../../../models/server-dropdown';

/*export interface IMultiKeyValueItemRendererAction {
    event;
    options: IServerDropdownOption[],
}*/

@Component({
    selector: 'app-multi-key-value-item-renderer',
    templateUrl: './multi-key-value-item-renderer.component.html',
    styleUrls: ['./multi-key-value-item-renderer.component.scss']
})
export class MultiKeyValueItemRendererComponent implements AgRendererComponent {

    params: any;
    tooltipContent = null;
    @Input() options: IServerDropdownOption[];
    optionsFiltered: IServerDropdownOption[] = []; // selected options
    @Input() showName = true;
    @Input() showValue = true;
    @Input() tooltipRenderer: Function;

    @Input() hasClickAction = false;

    // @Output() onClickAction: EventEmitter<IMultiKeyValueItemRendererAction> = new EventEmitter<IMultiKeyValueItemRendererAction>();

    constructor() {
    }

    agInit(params: any): void {
        // console.log('params inside multi key value item renderer ', params);
        setTimeout(() => {
            if (params) {
                this.params = params;
                this.options = params.value;
                this.optionsFiltered = this.options && this.options.filter(option => option.selected);
                this.showName = (params.showName && params.showName) === 'no' ? false : this.showName;
                this.showValue = (params.showValue && params.showValue) === 'no' ? false : this.showValue;
                if (params.tooltipRenderer) {
                    this.tooltipRenderer = params.tooltipRenderer;
                    this.tooltipContent = params.value && this.tooltipRenderer(params.value);
                }

                if (params.hasClickAction) {
                    this.hasClickAction = true;
                }
            }
        }, 0);
    }

    /*emitAction($event) {
        this.onClickAction.emit({event: $event, options: this.options});
    }*/

    refresh(params) {
        return false;
    }
}
