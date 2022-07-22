import {Injectable} from '@angular/core';
import {GridColumn, IGridColumnAgGrid} from '../models/grid-column';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ApiService} from './api/api.service';

@Injectable({
    providedIn: 'root'
})

export class GridColumnsService {

    static adaptAgGridColumn(column: any): IGridColumnAgGrid {
        return {
            colId: column.colId,
            field: column.field,
            headerName: column.headerName,
            hide: column.hide,
            position: column.position,
            sortable: column.sortable,
            width: column.width,
            ...(column.checkboxSelection && {checkboxSelection: column.checkboxSelection}),
            ...(column.type && {type: column.type}),
        };
    }

    constructor(private api: ApiService) {
    }

    fetchColumns(guid: string): Observable<GridColumn[]> {
        return this.api.get({endpoint: `/getgrid/${guid}`, useAuthUrl: true})
            .pipe(
                map((columns: any) => {
                    return columns.map((column) => {
                        return new GridColumn({
                            column_name: column.column_name,
                            guid: column.column_guid,
                            column_heading: column.column_heading.split('_').join(' '),
                            display: column.display === 1 && column.column_name !== 'uid',
                            filter: column.filter === 1,
                            position: column.position,
                        });
                    }).sort((a, b) => {
                        if (a.position < b.position) {
                            return -1;
                        }
                        if (a.position > b.position) {
                            return 1;
                        }
                        return 0;
                    });
                }),
            );
    }

    fetchColumnsAgGrid(guid: string): Observable<IGridColumnAgGrid[]> {
        return this.api.get({endpoint: `/getgrid/${guid}`, useAuthUrl: true})
            .pipe(
                map((res: any) => {
                    return res.Data && res.Data.map((column) => {
                        return GridColumnsService.adaptAgGridColumn(column);
                    }).sort((a, b) => {
                        if (a.position < b.position) {
                            return -1;
                        }
                        if (a.position > b.position) {
                            return 1;
                        }
                        return 0;
                    });
                }),
            );
    }

    toggleColumnVisibility(columnGuid: string, show: boolean) {
        const visibilityValue = show ? 1 : 0;
        return this.api.post({endpoint: `/setcolumn/${columnGuid}/${visibilityValue}`, useAuthUrl: true, body: {}});
    }

    toggleGridColumnVisibility(gridGuid: string, columnGuid: string, show: boolean) {
        const property = show ? 'show' : 'hide';
        return this.api.get({endpoint: `/gridpref/${gridGuid}/${columnGuid}/hide/${show}`, useAuthUrl: true});
    }

    setColumnWidth(gridGuid: string, columnGuid: string, newSize: number) {
        return this.api.get({endpoint: `/gridpref/${gridGuid}/${columnGuid}/width/${newSize}`, useAuthUrl: true});
    }

    setColumnPosition(gridGuid: string, columnGuid: string, position: number) {
        return this.api.get({endpoint: `/gridpref/${gridGuid}/${columnGuid}/position/${position}`, useAuthUrl: true});
    }

    deleteCustomLayout(gridGuid: string) {
        return this.api.post({endpoint: `/cleargrid/${gridGuid}`, useAuthUrl: true, body: {}});
    }

}
