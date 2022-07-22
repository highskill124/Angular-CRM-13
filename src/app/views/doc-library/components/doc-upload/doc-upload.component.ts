import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToasterService} from 'angular2-toaster';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {map, retry} from 'rxjs/operators';

export interface ITempFile {
    guid: string;
    orig_file_name: string;
    orig_file_size: string;
    orig_file_type: string;
    status: string;
    upload_id: string;
}

@Component({
    selector: 'app-doc-upload',
    templateUrl: './doc-upload.component.html',
    styleUrls: ['./doc-upload.component.css']
})

export class DocUploadComponent implements OnInit {

    public uploader: FileUploader = new FileUploader(
        {
            url: environment.socketUrl + '/file/Upload',
            isHTML5: true,
            method: 'POST',
            itemAlias: 'fileName',
            headers: [{name: 'x-access-token', value: JSON.parse(localStorage.getItem('token')).token}]
        }
    );
    public hasBaseDropZoneOver = false;
    tempFilesList: ITempFile[] = [];
    supportedFileTypes = [];

    collapseAll = false;

    constructor(private toaster: ToasterService, private http: HttpClient) {
        this.http.get(`${environment.apiUrl}/permittedFiles`)
            .pipe(
                map((types: any) => types.map(type => type.id)),
                retry(2),
            )
            .subscribe(fileTypes => {
                    this.supportedFileTypes = fileTypes;
                },
                (err) => console.error('Failed to fetch file types ', err));

        this.http.get(`${environment.socketUrl}/file/TmpFilesList`)
            .pipe(
                map((fileResult: any) => fileResult.data as ITempFile[]),
                retry(2),
            )
            .subscribe((fileList: ITempFile[]) => {
                    this.tempFilesList = fileList;
                    this.tempFilesList.forEach(file => {
                        // try {
                        const fileObject = new File([new Blob([''])], file.orig_file_name);
                        const fileItem = new FileItem(this.uploader, fileObject, {});
                        fileItem.file._createFromObject({size: +file.orig_file_size, type: file.orig_file_type, name: file.orig_file_name});
                        fileItem.isSuccess = true;
                        fileItem.isUploaded = true;
                        fileItem.progress = 100;

                        this.updateFileItemFormData(fileItem, {
                            fileid: file.upload_id,
                            orig_filename: file.orig_file_name,
                            file_type: file.orig_file_type,
                            file_size: +file.orig_file_size
                        });

                        this.instantiateFileItemAccordion(fileItem);

                        this.uploader.queue.push(fileItem);
                        /*} catch (err) {
                            let blob: any;
                            blob = new Blob(['']);
                            blob.name = file.orig_file_name;
                            blob.lastModifiedDate = null;
                            blob.webkitRelativePath = '';
                            this.uploader.addToQueue([blob]);
                        }*/
                    });
                },
                (err) => console.error('Failed to fetch file types ', err));
    }

    ngOnInit() {
        this.uploader.onAfterAddingFile = (file) => {
            // console.log(file);
            if (!this.isSupportedFileType(file.file.name)) {
                file.remove();
                this.toaster.pop('warning', 'Unsupported file type');
            } else {
                file.withCredentials = false;
            }
        };

        this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any) => {
            const data = JSON.parse(item._xhr.responseText).data;
            if (data) {
                this.updateFileItemFormData(item, {
                    fileid: data.fileid,
                    file_type: data.file_type,
                    orig_filename: data.orig_filename,
                    file_size: data.orig_file_size
                });
            }
            this.instantiateFileItemAccordion(item);
        };

        this.uploader.onErrorItem = (item: any, response: string, status: number, headers: any) => {
            this.toaster.pop('error', JSON.parse(response).error);
        };
    }

    instantiateFileItemAccordion(item) {
        if (!(typeof item.formData.accordionOpened === 'boolean')) {
            this.toggleFileItemAccordion(item);
        }
    }

    toggleFileItemAccordion(fileItem: FileItem) {
        if (!(typeof fileItem.formData.accordionOpened === 'boolean')) {
            fileItem.formData.accordionOpened = false;
        } else {
            fileItem.formData.accordionOpened = !fileItem.formData.accordionOpened;
        }
    }

    toggleFileItemAccordions() {
        this.collapseAll = !this.collapseAll;
        this.uploader.queue.forEach(item => {
            // filter queue using only items with accordion state
            if (typeof item.formData.accordionOpened === 'boolean') {
                item.formData.accordionOpened = this.collapseAll;
            }
        });
    }

    updateFileItemFormData(fileItem: FileItem, data: { fileid: string, orig_filename: string, file_type: string, file_size: number }) {
        fileItem.formData.push({
            fileInfo: {
                fileid: data.fileid,
                orig_filename: data.orig_filename,
                file_type: data.file_type,
                file_size: data.file_size,
            }
        });
    }

    isSupportedFileType(filename: string): boolean {
        let isSupported = false;
        const fileType = filename.split('.').pop();
        if (fileType) {
            this.supportedFileTypes.forEach(type => {
                if (type === fileType) {
                    isSupported = true;
                }
            });
        } else {
            // fail safe
            return true;
        }
        return isSupported;
        /*const matches = (filename.match(/.(jpg|jpeg|png)$/i));
        return !!(matches && matches != null && matches.length > 0);*/
    }

    fileOverBase(e: any) {
        this.hasBaseDropZoneOver = e;
    }

    clearQueue() {
        this.uploader.queue.forEach(item => this.removeItem(item));
    }

    removeItem(item: FileItem) {
        const fileId = item.formData[0]['fileInfo']['fileid'];
        if (item.isUploaded && fileId) {
            this.http.post(`${environment.socketUrl}/file/rmTmpFile/${fileId}`, {})
                .subscribe((res: any) => {
                        if (res.Success === true) {
                            this.toaster.pop('success', 'Success!', res.Message);
                            item.remove();
                        } else {
                            this.toaster.pop('error', res.Message);
                        }
                    },
                    err => this.toaster.pop('error', err));
        } else {
            item.remove();
        }
    }
}
