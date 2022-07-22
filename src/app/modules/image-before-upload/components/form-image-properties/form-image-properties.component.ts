import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {FormCanDeactivate} from '../../../../guards/form-can-deactivate/form-can-deactivate';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {Observable} from 'rxjs';
import {IUploadedImageProperties} from '../../uploaded-image-properties';
import {ImagePropertiesService} from '../../../../services/image-properties.service';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-form-image-properties',
    templateUrl: './form-image-properties.component.html',
    styleUrls: ['./form-image-properties.component.scss'],
})
export class FormImagePropertiesComponent extends FormCanDeactivate implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    private _imageProperties: IUploadedImageProperties;

    @Input() leftButtonText;

    folders$: Observable<IServerDropdownOption[]>;

    @Output() onSubmitSuccess: EventEmitter<IUploadedImageProperties> = new EventEmitter<IUploadedImageProperties>();
    @Output() onLeftButtonSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    alive = true;
    @Input() set imageProperties(imageProperties: IUploadedImageProperties) {
        this._imageProperties = imageProperties;
        if (this.form) {
            this.filename.setValue(imageProperties.filename);
            this.original_filename.setValue(imageProperties.original_filename);
            this.myFile.setValue(imageProperties.myFile);
            this.user_id.setValue(imageProperties.user_id);
        }
    }
    get imageProperties() {
        return this._imageProperties;
    }

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private imagePropertiesService: ImagePropertiesService,
        public toasterService: ToasterService,
    ) {
        super();
    }

    ngOnInit() {
        this.folders$ = this.imagePropertiesService.foldersList();
        this.initForm();

        this.folders$.subscribe(res => console.log(res))
    }

    initForm() {
        this.form = this.fb.group({
            filename: [this.imageProperties && this.imageProperties.filename, Validators.required],
            original_filename: [this.imageProperties && this.imageProperties.original_filename, Validators.required],
            myFile: [this.imageProperties && this.imageProperties.myFile],
            user_id: [this.imageProperties && this.imageProperties.user_id],
            folder_name: [this.imageProperties && this.imageProperties.folder_name],
            new_folder_name: [{value: '', disabled: true}],
            share_image: [this.imageProperties && this.imageProperties.share_image],
        });
    }

    get filename() {
        return this.form.get('filename');
    }

    get original_filename() {
        return this.form.get('original_filename');
    }

    get myFile() {
        return this.form.get('myFile');
    }

    get user_id() {
        return this.form.get('user_id');
    }

    get folder_name() {
        return this.form.get('folder_name');
    }

    get new_folder_name() {
        return this.form.get('new_folder_name');
    }

    get share_image() {
        return this.form.get('share_image');
    }

    /**
     * Disables and hides the folder_name input (condition is in view),
     * then enables and shows the new_folder_name input
     */
    showNewFolderNameInput() {
        this.folder_name.disable();
        this.new_folder_name.enable();
    }

    /**
     * Disables and hides the new_folder_name input (condition is in view),
     * then enables and shows the folder_name input
     */
    showFolderNameInput() {
        this.new_folder_name.disable();
        this.folder_name.enable();
    }

    leftButtonSelected() {
        this.onLeftButtonSelect.emit(true);
    }

    create(formData) {
        formData.folder_name = this.new_folder_name.enabled ? formData.new_folder_name : formData.folder_name;
        delete formData.new_folder_name;
        this.errors = this.messages = [];
        this.submitted = true;

        this.http.post(environment.imageUploadUrl, formData)
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        const imageProperties = {
                            link: res.link,
                            ...formData,
                        };
                        this.onSubmitSuccess.emit(imageProperties);
                    } else {
                        this.submitted = false;
                        this.showMessages.error = true;
                        this.toasterService.pop('error', res.Message);
                        this.errors = [res.Message];
                    }
                },
                error => {
                    this.submitted = false;
                    this.showMessages.error = true;
                    this.toasterService.pop('error', error.Message);
                    this.errors = [error.Message];
                });
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
