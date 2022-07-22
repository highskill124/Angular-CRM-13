import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TemporaryStorageService {

    storageData:Array<any> = [];

    constructor() {      
    }

    set(key, value) {
        this.storageData[key] = value;
    }

    get(key) {
       return this.storageData[key];
    }
}
