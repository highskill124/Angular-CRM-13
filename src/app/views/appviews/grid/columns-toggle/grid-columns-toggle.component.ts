import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GridColumn} from '../../../../models/grid-column';

export interface IColumnsToggleResult {
  columnGuid: string;
  columnHeading: string;
  columnVisibility: boolean;
}

@Component({
  selector: 'app-columns-toggle',
  templateUrl: './grid-columns-toggle.component.html',
  styleUrls: ['./grid-columns-toggle.component.css']
})
export class GridColumnsToggleComponent implements OnInit {

  @Input() columns: GridColumn[] = [];
  @Output() columnUpdated: EventEmitter<IColumnsToggleResult> = new EventEmitter<IColumnsToggleResult>();
  constructor() { }

  ngOnInit() {
  }

  onUpdate(columnHeading: string, columnGuid: string, checkboxValue: boolean) {
    this.columnUpdated.emit({columnHeading: columnHeading, columnGuid: columnGuid, columnVisibility: checkboxValue});
  }
}
