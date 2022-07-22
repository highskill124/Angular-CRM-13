import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root',
})



export class ApiService {
    apiUrl: 'https://nodejs.pub.pgtel.net/';

    private static initRequestOptionsAndParams(config: any) {
        // initialize request options object if one was not passed in with config
        if (!config.reqOpts) {
            config.reqOpts = {
                params: new HttpParams()
            };
        }

        // Support easy query params for GET requests
        if (config.params) {
            config.reqOpts.params = new HttpParams();
            for (let k in config.params) {
                config.reqOpts.params = config.reqOpts.params.set(k, config.params[k]);
            }
        }

        return config;
    }

    constructor(public http: HttpClient) {
    }

    get(config: { endpoint: string, useAuthUrl?: boolean, params?: any, reqOpts?: any }) {
        config = ApiService.initRequestOptionsAndParams(config);

        return this.http.get('https://nodejs.pub.pgtel.net' + config.endpoint, config.reqOpts);
    }

    basicget(endpoint: string) {
    
        return this.http.get('https://nodejs.pub.pgtel.net' + endpoint);
    }

    customGet(endpoint: string) {
        return this.http.get(endpoint);
    }

    post(config: { endpoint: string, useAuthUrl?: boolean, body: any, params?: any, reqOpts?: any }) {
        config = ApiService.initRequestOptionsAndParams(config);
        console.log('Body : ' + JSON.stringify(config.body))
        return this.http.post(this.apiUrl+ config.endpoint, config.body, config.reqOpts);
    }

    put(config: { endpoint: string, useAuthUrl?: boolean, body: any, reqOpts?: any }) {
        return this.http.put(this.apiUrl + config.endpoint, config.body, config.reqOpts);
    }

    delete(config: { endpoint: string, useAuthUrl?: boolean, reqOpts?: any }) {
        return this.http.delete(this.apiUrl + config.endpoint, config.reqOpts);
    }

    patch(config: { endpoint: string, useAuthUrl?: boolean, body: any, reqOpts?: any }) {
        return this.http.patch(this.apiUrl + config.endpoint, config.body, config.reqOpts);
    }

  
}
