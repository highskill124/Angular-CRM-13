import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IUploadedImageProperties} from '../../uploaded-image-properties';
import {FormImagePropertiesComponent} from '../form-image-properties/form-image-properties.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

// TODO : Check if we need the import of ChangeDetection if not remove code
// import {ChangeDetection} from '@angular/cli/lib/config/schema';

@Component({
    selector: 'app-modal-image-properties',
    templateUrl: './modal-image-properties.component.html',
    styleUrls: ['./modal-image-properties.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalImagePropertiesComponent implements OnInit {

    @ViewChild('formImagePropertiesComponent', {read: FormImagePropertiesComponent})
    public formImagePropertiesComponent: FormImagePropertiesComponent;


    @Output() onDismiss: EventEmitter<boolean | IUploadedImageProperties> = new EventEmitter<boolean | IUploadedImageProperties>();

    constructor(@Inject(MAT_DIALOG_DATA) public imageProperties: IUploadedImageProperties,
                public dialogRef: MatDialogRef<ModalImagePropertiesComponent>) {

    }

    ngOnInit() {

    }

    dismiss(submittedData?: IUploadedImageProperties) {
        this.dialogRef.close(submittedData ? submittedData : true)
    }

}
