﻿import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socketId;
  public isConnected = false;
    /**
     * Can be accessed only within this class
     */
  private _client;

  constructor(private http: HttpClient) {
    // this.socketInit();
  }

    /**
     * Other classes will access _client through this
     */
  get client() {
      return this._client;
  }

  async socketInit() {
      this._client = io(`${environment.socketUrl}`);
      await new Promise<void>((res) => {
        this.client.on('connect', () => {

            this.socketId = this.client.id;

            this.client.on('authResponse', (authResponse: boolean) => {
                console.log('socket connected ', authResponse);
                console.log('Socket ID:  ' + this.socketId);
                this.isConnected = authResponse;
            });
            this.client.on('disconnect', () => this.isConnected = false);

            res();
        });
    })
    .catch((e) => console.log(`Socket.io error: ${e.message}`));
  }

    ioInject(event, handler) {
      if (this.client) {
          this.client.on(event, handler);
      } else {
          console.warn('Socket client not initialized');
      }
    }

    emit<T>(event: string, data: T) {
        if (this.client) {
            this.client.emit(event, data);
        } else {
            console.warn('Socket client not initialized');
        }
    }
}
