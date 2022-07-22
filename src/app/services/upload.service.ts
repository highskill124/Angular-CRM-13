import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadCsv(file, importTypeId: string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.socketUrl}/import/upload/${importTypeId}`, formData, {
      reportProgress: true, observe: 'events'
    });
  }

}
