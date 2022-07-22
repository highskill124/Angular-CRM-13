import {Injectable} from '@angular/core';
import {ApiService} from './api/api.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IServerDropdownOption} from '../models/server-dropdown';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ImagePropertiesService {

    constructor(public api: ApiService, private authService: AuthService) {
    }

    get userId() {
        const user = this.authService.getStoredUser();
        return user && user.guid;
    }

    foldersList(user_id = this.userId): Observable<IServerDropdownOption[]> {
        return this.api.get({endpoint: `/emailfolder?user_id=${user_id}`, useAuthUrl: true}).pipe(
            map((res: any) => {
                console.log(res)
                return res.Data.map(option => {
                    return {
                        value: option.folder_name,
                        name: option.folder_name === '' ? '/ (default)' : option.folder_name,
                        selected: option.selected,
                    };
                })
            }),
        );
    }
}
