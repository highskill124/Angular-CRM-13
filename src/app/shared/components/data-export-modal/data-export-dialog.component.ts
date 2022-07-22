import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GridExportType} from '../../../modules/custom-ag-grid/ag-grid-base';
import {dataExportFormats} from '../../../models/data-export-formats';
import {IServerDropdownOption} from '../../../models/server-dropdown';

export interface IDataExportDialogResult {
    fileName: string;
    exportFormat: GridExportType;
    exportAllColumns?: boolean;
}

@Component({
    selector: 'app-data-export-dialog',
    templateUrl: './data-export-dialog.component.html',
    styleUrls: ['./data-export-dialog.component.scss']
})
export class DataExportDialogComponent {

    @Input() exportFormats: IServerDropdownOption[] = [...dataExportFormats];
    dialogResult: IDataExportDialogResult = <IDataExportDialogResult>{};

    @Output() onResult: EventEmitter<IDataExportDialogResult> = new EventEmitter<IDataExportDialogResult>();

    submit($event) {
        if (!this.dialogResult.exportFormat) {
            return;
        }

        this.onResult.emit(this.dialogResult);
        $event.dialog.close();
    }
}
