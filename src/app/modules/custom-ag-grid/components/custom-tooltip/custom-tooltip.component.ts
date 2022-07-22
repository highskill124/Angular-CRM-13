import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.scss']
})
export class CustomTooltipComponent implements ICellRendererAngularComp {

  params: any;
  data: any;

  agInit(params): void {
    this.params = params;

    this.data = {...params.value} || {};
    this.data.color = this.params.color || 'white';
    if (params.renderFunction) {
        this.data.renderedHtml = this.params.renderFunction(params.value);
    }
  }

  refresh(params: any): boolean {
      return false;
  }

}
