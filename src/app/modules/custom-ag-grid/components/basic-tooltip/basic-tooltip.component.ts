import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';

@Component({
    selector: 'ag-tooltip-component',
    templateUrl: './basic-tooltip.component.html',
    styleUrls: ['./basic-tooltip.component.scss'],
})

export class CustomTooltip implements ITooltipAngularComp {
    private params!: { color: string } & ITooltipParams;
    public data!: any;
    public color!: string;

    agInit(params: { color: string } & ITooltipParams): void {
      this.params = params;

      this.data = params.api!.getDisplayedRowAtIndex(params.rowIndex!)!.data;
      this.color = this.params.color || 'white';
    }
  }
