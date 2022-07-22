import {Injectable} from '@angular/core';
import {
    CsvFileTypes,
    IgxCsvExporterOptions,
    IgxCsvExporterService,
    IgxExcelExporterOptions,
    IgxExcelExporterService
} from 'igniteui-angular';
import {GridExportType} from '../modules/custom-ag-grid/ag-grid-base';
import {ColDef} from 'ag-grid-community';

@Injectable({
    providedIn: 'root',
})

export class DataExportService {

    alive = false;

    constructor(
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
    ) {
    }

    formatEmails = <T = any>(arr: Array<T>) => {
        return arr.map(e => {
            return Object.entries(e).map(en => en.join(': ')).join(';')
        }).join(';');
    };

    /**
     * Assign export data to column_def fields here
     * @param dataObject
     * @param column_defs
     */
    arrangeData = (dataObject, column_defs: ColDef[]) => {
        // copy over all keys from column_defs to a new object we'll assign the dataObject to
        return column_defs.reduce((obj, item) => {
            /**
             * For each of the column definitions, use it's headerName as the key of the new object being created with
             * arr.reduce, and use it's field to find the headerName's corresponding data value in the dataObject
             */
            return (obj[item.headerName] = dataObject[item.field], obj);
        }, {});
    };

    public handleExport<T = any>(params: {
        dataFormatter?: (data: T) => T,
        export_data: Array<T>,
        export_def?: ColDef[],
        fileName?: string,
        exportFormat: GridExportType,
    }) {
        /*if (params.dataFormatter) {
            params.data = params.data.map(item => params.dataFormatter(item));
        }*/
        const arrangedExportData = params.export_data.map((item: any) => {
            if (item.emails) {
                item.emails = this.formatEmails(item.emails);
            }
            if (item.phones) {
                item.phones = this.formatEmails(item.phones);
            }

            return item;
        }).map(item => this.arrangeData(item, params.export_def));

        switch (params.exportFormat) {
            case 'excel':
                this.excelExportService.exportData(
                    arrangedExportData,
                    new IgxExcelExporterOptions(params.fileName || 'ExportFileFromData')
                );

                break;

            case 'csv':
                this.csvExportService.exportData(
                    arrangedExportData,
                    new IgxCsvExporterOptions(params.fileName || 'ExportFileFromData', CsvFileTypes.CSV)
                );
                break;
        }
    }

    ngOnInit() {
    }

}
