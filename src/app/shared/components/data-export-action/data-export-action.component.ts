import {Component, EventEmitter, Output} from '@angular/core';
import {GridExportType} from '../../../modules/custom-ag-grid/ag-grid-base';
import {dataExportFormats} from '../../../models/data-export-formats';
import {IServerDropdownOption} from '../../../models/server-dropdown';

@Component({
    selector: 'app-data-export-action',
    templateUrl: './data-export-action.component.html',
    styleUrls: ['./data-export-action.component.scss']
})
export class DataExportActionComponent {

    exportFormats: IServerDropdownOption[] = [...dataExportFormats];

    @Output() exportTypeSelected: EventEmitter<GridExportType> = new EventEmitter<GridExportType>();

    constructor() {
    }

    onExportTypeSelect(type: GridExportType) {
        this.exportTypeSelected.emit(type);
    }
}
