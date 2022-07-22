import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class ApiService {
    url = environment.socketUrl;
    authUrl = environment.apiUrl;

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

        return this.http.get(this.apiUrl(config.useAuthUrl) + config.endpoint, config.reqOpts);
    }

    post(config: { endpoint: string, useAuthUrl?: boolean, body: any, params?: any, reqOpts?: any }) {
        config = ApiService.initRequestOptionsAndParams(config);
        return this.http.post(this.apiUrl(config.useAuthUrl) + config.endpoint, config.body, config.reqOpts);
    }

    put(config: { endpoint: string, useAuthUrl?: boolean, body: any, reqOpts?: any }) {
        return this.http.put(this.apiUrl(config.useAuthUrl) + config.endpoint, config.body, config.reqOpts);
    }

    delete(config: { endpoint: string, useAuthUrl?: boolean, reqOpts?: any }) {
        return this.http.delete(this.apiUrl(config.useAuthUrl) + config.endpoint, config.reqOpts);
    }

    patch(config: { endpoint: string, useAuthUrl?: boolean, body: any, reqOpts?: any }) {
        return this.http.patch(this.apiUrl(config.useAuthUrl) + config.endpoint, config.body, config.reqOpts);
    }

    private apiUrl(useAuthUrl = false) {
        return useAuthUrl ? this.authUrl : this.url;
    }
}
