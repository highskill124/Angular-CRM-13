import {ColDef} from 'ag-grid-community';

export interface IGridColumn {
    guid: string;
    column_name: string;
    column_heading: string;
    display: boolean;
    filter: boolean;
    position: number;
    type?: GridColumnType;
}

export interface IGridColumnAgGrid extends ColDef {
    colId: string;
    field: string;
    headerName: string;
    position?: number;
    hide? : boolean;
    sortable? : boolean;
    width? : number;
    type? : string;
}

export enum GridColumnType {
    DATE = 'date',
    STRING = 'string',
}

export class GridColumn {
    guid: string;
    column_name: string;
    column_heading: string;
    display: boolean;
    filter: boolean;
    position: number;
    type?: GridColumnType;

    constructor(column: IGridColumn) {
        this.guid = column.guid;
        this.column_name = column.column_name;
        this.column_heading = column.column_heading;
        this.display = column.display;
        this.filter = column.filter;
        this.position = column.position;
        if (this.columnIsDate(column.column_name)) {
            this.type = GridColumnType.DATE;
        }
    }

    columnIsDate(columnName: string) {
        const dateColumns = ['event_date', 'start_date', 'end_date', 'created_on'];
        let isDate = false;
        dateColumns.forEach(col => {
            if (col.toLowerCase() === columnName.toLowerCase()) {
                isDate = true;
            }
        });
        return isDate;
    }
}
