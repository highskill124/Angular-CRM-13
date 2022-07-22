import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster';
import {environment} from '../../../../../environments/environment';
import {map, retry} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-doc-upload-form',
    templateUrl: './doc-upload-form.component.html',
    styleUrls: ['./doc-upload-form.component.scss']
})
export class DocUploadFormComponent implements OnInit, OnDestroy {

    @Input() item: any;
    formData: any;

    @Output() formSubmitted = new EventEmitter();

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    transactionList$: Observable<any>;
    clientIdList$: Observable<any>;
    libraryList$: Observable<any>;
    doclibraries$: Observable<any>;
    libraryDocsList$: Observable<any>;
    alive = true;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private toasterService: ToasterService,
    ) {
    }

    get client_id() {
        return this.form.get('client_id');
    }

    get new_version() {
        return this.form.get('new_version');
    }

    get zip() {
        return this.form.get('zip');
    }

    get privacy() {
        return this.form.get('privacy');
    }

    get doclib_acronym() {
        return this.form.get('doclib_acronym');
    }

    ngOnInit() {
        this.formData = this.item.formData[0]['fileInfo'];
        // this.formData = JSON.parse(this.item._xhr.responseText).data;
        // console.log('formdata permanent form ', this.formData);
        this.initForm();
        this.bootstrapForm();

        this.clientIdList$ = this.http.get(`${environment.apiUrl}/clientGuid`)
            .pipe(
                map((options: any) => options.data),
            );
        this.libraryList$ = this.http.get(`${environment.socketUrl}/file/Librarys`)
            .pipe(
                map((options: any) => options.data),
            );
        this.doclibraries$ = this.http.get(`${environment.socketUrl}/file/DocLibrarys`)
            .pipe(
                map((options: any) => options.data),
            );
    }

    initForm() {
        /*
        {fileid: "000000005J", tmp_filename: "000000005J.png", orig_filename: "ip.png", file_type: "png", file_size: 45172, …}
         */
        this.form = this.fb.group({
            fileid: [this.formData ? this.formData.fileid : '', Validators.required],
            type: [this.formData ? this.formData.file_type : ''],
            orig_filename: [this.formData ? this.formData.orig_filename : ''],
            client_id: [''],
            transaction_id: [''],
            library: [''],
            parent_id: [''],
            new_version: [false],
            zip: [false],
            subject: [''],
            notes: [''],
            privacy: [false],
            doclib_acronym: [''],
            doctype_guid: [''],
        });
    }

    private bootstrapForm() {
        this.client_id.valueChanges.subscribe(client_id => {
            if (client_id) {
                this.setTransactionList(client_id);
            }
        });
        this.doclib_acronym.valueChanges.subscribe(acronym => {
            if (acronym) {
                this.setLibraryDocsList(acronym);
            }
        });
    }

    setLibraryDocsList(doclib_acronym: string) {
        this.libraryDocsList$ = this.http.get(`${environment.socketUrl}/file/LibraryDocs/${doclib_acronym}`)
            .pipe(
                map((options: any) => options.data),
                retry(2),
            );
    }

    setTransactionList(client_id: string) {
        this.transactionList$ = this.http.get(`${environment.apiUrl}/transGuid/${client_id}`)
            .pipe(
                map((options: any) => options.data),
                retry(2),
            );
    }

    create(formData) {
        this.errors = this.messages = [];
        this.submitted = true;

        this.http.request(
            'post',
            `${environment.socketUrl}/file/Save`,
            {body: formData},
        ).subscribe((res: any) => {
                // console.log(res);
                if (res.Success === true) {
                    this.formSubmitted.emit(true);
                    this.toasterService.pop('success', 'Success!', res.Message);
                } else {
                    this.submitted = false;
                    this.showMessages.error = true;
                    this.toasterService.pop('error', res.Message);
                    this.errors = [res.Message];
                }
            },
            (error) => {
                this.submitted = false;
                this.toasterService.pop('error', error);
                console.error('Failed to save file to permanent storage ', error);
            },
        );
    }

    ngOnDestroy() {
        this.alive = false;
    }

}
