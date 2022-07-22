import {Inject, Injectable, NgZone, OnDestroy} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {switchMap, take, takeWhile} from 'rxjs/operators';
import {IgxOverlayService, OverlayEventArgs} from 'igniteui-angular';
import {ModalImagePropertiesComponent} from '../modules/image-before-upload/components/modal-image-properties/modal-image-properties.component';
import {IUploadedImageProperties} from '../modules/image-before-upload/uploaded-image-properties';
import {HttpClient} from '@angular/common/http';
import {ToasterService} from 'angular2-toaster';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class FroalaUploadService implements OnDestroy {

    private editorInstance: any;
    readonly imageUploadUrl = environment.imageUploadUrl;
    readonly fileUploadUrl = environment.fileUploadUrl;
    readonly loadImagesUrl = environment.loadImagesUrl;
    readonly loadImageUrl = environment.loadImageUrl;
    readonly deleteImageUrl = environment.deleteImageUrl;

    private alive = true;

    constructor(
        private authService: AuthService,
        private http: HttpClient,
        private zone: NgZone,
        private matDialog: MatDialog,
        public toasterService: ToasterService,
        @Inject(IgxOverlayService) private overlayService: IgxOverlayService,
    ) {
    }

    get userId() {
        const user = this.authService.getStoredUser();
        return user && user.guid;
    }

    initImageManagerOptions(): Object {
        return {
            // Set page size.
            imageManagerPageSize: 20,

            // Set a scroll offset (value in pixels).
            imageManagerScrollOffset: 10,

            // Set the load images request URL.
            imageManagerLoadURL: this.loadImagesUrl,

            // Set the load images request type.
            imageManagerLoadMethod: 'GET',

            // Additional load params.
            imageManagerLoadParams: {user_id: this.userId},

            // Set the delete image request URL.
            imageManagerDeleteURL: this.deleteImageUrl,

            // Set the delete image request type.
            imageManagerDeleteMethod: 'DELETE',

            // Additional delete params.
            imageManagerDeleteParams: {user_id: this.userId},
        };
    }

    initImageManagerEvents(): Object {
        const _froalaUploadService = this;
        return {
            'froalaEditor.imageManager.error': function (e, editor, error, response) {
                // @note: Response contains the original server response to the request if available.
                // Parse response to get image url.
                const responseInJson = JSON.parse(response);
                if (error.code === 21) { // Error during delete image request
                    _froalaUploadService.toasterService.pop('error', responseInJson.Message);
                }
            },
        };
    }

    initUploadOptions(): Object {
        return {
            // Set the image upload parameter.
            imageUploadParam: 'myFile',

            // Set the image upload URL.
            imageUploadURL: this.imageUploadUrl,

            // Additional upload params.
            imageUploadParams: {user_id: this.userId},

            // Set request type.
            imageUploadMethod: 'POST',

            // Set max image size to 5MB.
            imageMaxSize: 5 * 1024 * 1024,

            // Allow to upload PNG and JPG.
            imageAllowedTypes: ['jpeg', 'jpg', 'png'],
        };
    }

    initUploadEvents(): Object {
        const _froalaUploadService = this;
        return {
            'image.beforeUpload': function (images) {
                // make copies of the data passed in since they are lost after false is returned to froala from this callback
                const copies = {
                    editor: this,  // {...editor}, // make full copy of editor object
                    // e: {...e}, // make full copy of the event
                    images: {...images}, // make full copy of the images
                };

                let imageBase64 = null;

                // create reader
                if (images.length) {
                    // Create a File Reader.
                    const reader = new FileReader();
                    // Set the reader to insert images when they are loaded.
                    reader.onload = (ev) => {
                        imageBase64 = ev.target['result'];
                        console.log(imageBase64);

                        _froalaUploadService.editorInstance = this;

                        _froalaUploadService.zone.run(() => {
                            const dialogRef = _froalaUploadService.matDialog.open(ModalImagePropertiesComponent,
                                {
                                    data: {
                                        filename: copies.images[0].name.split('.')[0],
                                        original_filename: copies.images[0].name,
                                        myFile: imageBase64,
                                        user_id: _froalaUploadService.userId,
                                    },
                                    width: '500px', panelClass: 'upload-dialog'
                                });

                            dialogRef.afterClosed().subscribe((res: IUploadedImageProperties) => {
                                this.image.insert(`${res.link}`, false, null, copies.editor.image.get(), res);
                            })
                        });
                        // console.log('file reader result ', imageBase64);
                    };
                    // Read image as base64.
                    reader.readAsDataURL(images[0]);
                }


                /*const overlayId = _froalaUploadService.overlayService.show(ModalImagePropertiesComponent);

                _froalaUploadService.overlayService.onOpened.pipe(
                    takeWhile(_ => _froalaUploadService.alive),
                    // filter(event => !!(event.componentRef && event.componentRef.instance)),
                    switchMap(($overlayEvent: OverlayEventArgs) => {
                        // console.log('event ', copies.e, ' editor ', copies.editor, ' images ', copies.images);
                        // @ts-ignore
                        const modalInstance = <ModalImagePropertiesComponent>$overlayEvent.componentRef.instance;
                        // Splitting the name (filename) here and taking the first part which represents the name without the extension
                        modalInstance.imageProperties = {
                            filename: copies.images[0].name.split('.')[0],
                            original_filename: copies.images[0].name,
                            myFile: imageBase64,
                            user_id: _froalaUploadService.userId,
                        };
                        return modalInstance.onDismiss;
                    }),
                    take(1), // this makes sure the subscription stays alive for only one instance
                )
                    .subscribe((modalResult: IUploadedImageProperties | boolean) => {
                        if (typeof modalResult === 'boolean') {
                            // just dismiss the dialog, user didn't fill the form
                            _froalaUploadService.overlayService.hide(overlayId);
                        } else {
                            console.log(modalResult, this.image.get());
                            // Insert image into editor.
                            this.image.insert(`${modalResult.link}`, false, null, copies.editor.image.get(), modalResult);
                            _froalaUploadService.overlayService.hide(overlayId);
                        }
                    });
*/

                // editor.options.imageUploadParams[csrf_token_name]=csrf_token_value;
                /*if (images.length) {
                    // Create a File Reader.
                    const reader = new FileReader();
                    // Set the reader to insert images when they are loaded.
                    reader.onload = (ev) => {
                        const result = ev.target['result'];
                        editor.image.insert(result, null, null, editor.image.get());
                        console.log(ev, editor.image, ev.target['result'])
                    };
                    // Read image as base64.
                    reader.readAsDataURL(images[0]);
                }*/
                // Return false if you want to stop the image upload.
                return false;
            },
            'image.uploaded': function (response) {
                // Parse response to get image url.
                console.log(response)
                const img_url = JSON.parse(response).link;

                // Insert image.
                // editor.image.insert(`${_froalaUploadService.loadImageUrl}${img_url}`, false, null, editor.image.get(), response);

                return false;
            },
            'froalaEditor.image.inserted': function (e, editor, $img, response) {
                // _that.editorInstance = editor;
                // Image was inserted in the editor.
            },
            'froalaEditor.image.replaced': function (e, editor, $img, response) {
                // _that.editorInstance = editor;
                // Image was replaced in the editor.
            },
            'froalaEditor.image.error': function (e, editor, error, response) {
                // Bad link.
                if (error.code === 1) {
                    //
                } else if (error.code === 2) {
                    //
                } else if (error.code === 3) {
                    //
                } else if (error.code === 4) {
                    //
                } else if (error.code === 5) {
                    //
                } else if (error.code === 6) {
                    //
                } else if (error.code === 7) {
                    //
                }

                // Response contains the original server response to the request if available.
            },
        };
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}
