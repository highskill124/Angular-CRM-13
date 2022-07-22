import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {UploadService} from '../../../../services/upload.service';
import {Observable} from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {SocketService} from '../../../../services/socket.service';
import { StateService   } from '../../../../services/header.service'


@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

    // csv = null;
    importTypeId;
    message = null;
    uploadedPercentage = 0;
    importTypeOptions$: Observable<Array<IServerDropdownOption>>;
    processedRecord = 0;
    totalRecord = 0;
    fileInput: any

    constructor(
        private router: Router,
        private uploadService: UploadService,
        private cbLookupService: CouchbaseLookupService,
        private socketService: SocketService,
        private state: StateService
    ) {
        this.importTypeOptions$ = this.cbLookupService.getOptions(DropdownGuids.IMPORT_TYPE);
        this.state.setTitle('Upload Form');
    }

    ngOnInit() {
    }

    upload($event) {
        this.uploadedPercentage = 0;
        this.message = null;
        const file = $event.target.files[0];

        this.socketService.ioInject('recCount', (count) => {
            this.message = `Total record count ${count}`;
            this.totalRecord = count;
            console.log(this.totalRecord)
        });

        this.socketService.ioInject('recProcessed', (range) => {
            // this.uploadedPercentage = Number(range.rowcount) / Number(range.recCount) * 100;
            this.message = `${file.name} importing..`;
            this.processedRecord = Number(range.rowcount);
            this.totalRecord = Number(range.recCount);
            console.log(`${file.name} importing..${this.processedRecord}`)
        });

        this.socketService.ioInject('recSaved', (payload) => {
            console.log('res saved event ', payload);
            this.message = `${payload.data} Total: ${payload.recordcount}`;
            this.processedRecord = payload.data;
        });

        this.socketService.ioInject('recError', (err) => {
            this.message = `Something went wrong! Please try again. ${err}`;
            this.uploadedPercentage = 0;
        });

        this.uploadService.uploadCsv(file, this.importTypeId).subscribe((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        this.message = `${file.name} uploading..`;
                        break;
                    case HttpEventType.Response:
                        this.message = event.body.data;
                        break;
                    case 1: {
                        if (Math.round(this.uploadedPercentage) !== Math.round(event['loaded'] / event['total'] * 100)) {
                            this.uploadedPercentage = event['loaded'] / event['total'] * 100;
                        }
                        break;
                    }
                }
            },
            error => {
                console.log(error);
                this.message = 'Something went wrong! Please try again.';
                this.uploadedPercentage = 0;
                this.fileInput = null;
            });

    }

    public cleanUploadedFile() {
        this.fileInput = null;
        this.uploadedPercentage = 0;
        this.message = '';
     }

}
