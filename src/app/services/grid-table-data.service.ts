import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GridTableDataService {

    constructor(private http: HttpClient) {
    }

    fetchData(url) {
        return this.http.post(`${environment.socketUrl}${url}`, {});
    }

    toggleColumnVisibility(columnGuid: string, show: boolean) {
        const visibilityValue = show ? 1 : 0;
        return this.http.post(`${environment.apiUrl}/setcolumn/${columnGuid}/${visibilityValue}`, {});
    }
}

