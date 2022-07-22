import {Injectable} from '@angular/core';
import {FilterSetting} from '../model/filter-setting.model';
import {GridColumnsService} from '../../../services/grid-columns.service';
import {CouchbaseLookupService} from '../../../services/couchbase-lookup.service';
import {IGridColumnAgGrid} from '../../../models/grid-column';
import {map} from 'rxjs/operators';
import {IApiResponseBody} from '../../../models/api-response-body';
import {Observable} from 'rxjs';
import {FilterResponseData} from '../model/filter-response-data.model';
import {ApiService} from '../../../services/api/api.service';
import {FilterGridActionsComponent} from '../components/filter-grid-actions/filter-grid-actions.component';

@Injectable({providedIn: 'root'})
export class FilterGridService {

    public supplementaryColumns: IGridColumnAgGrid[] = [{
        colId: undefined,
        field: undefined,
        headerName: 'Actions',
        minWidth: 40,
        sortable: false,
        suppressMenu: true,
        cellRendererFramework: FilterGridActionsComponent,
        pinned: 'right',
    }];

    constructor(
        private gridColumnService: GridColumnsService,
        private couchbaseLookupService: CouchbaseLookupService,
        private api: ApiService,
    ) {

    }

    getFilterConfig(gridConfigId: string) {
        return (this.api.get({
            endpoint: `/gridfilter/${gridConfigId}`,
            useAuthUrl: true
        }) as Observable<IApiResponseBody>)
            .pipe(map((reply: IApiResponseBody<FilterResponseData[]>) => {
                const data: FilterSetting[] = [];
                if (reply.Success && reply.Data) {
                    reply.Data.sort((a, b) => a.order < b.order ? -1 : 1)
                    reply.Data
                        .filter(config => config.enabled)
                        .forEach(config => {
                            data.push({
                                label: config.label,
                                group: config.fieldname,
                                type: config.type,
                                filters: config.options,
                            });
                        });
                }
                return data;
            }));
    }

    getColumnConfig(columnConfigId: string) {
        return this.gridColumnService.fetchColumnsAgGrid(columnConfigId);
    }

    getQuickSearchTypeOptions(quickSearchTypeOptionConfigId: string) {
        return this.couchbaseLookupService.getOptions(quickSearchTypeOptionConfigId);
    }

}
