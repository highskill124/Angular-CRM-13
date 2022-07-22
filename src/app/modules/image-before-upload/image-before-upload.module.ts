import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {GuidDropdownModule} from '../guid-dropdown/guid-dropdown.module';
import {FormImagePropertiesComponent} from './components/form-image-properties/form-image-properties.component';
import {ModalImagePropertiesComponent} from './components/modal-image-properties/modal-image-properties.component';

const ENTRY_COMPONENTS = [
    ModalImagePropertiesComponent,
];

const COMPONENTS = [
    ...ENTRY_COMPONENTS,
    FormImagePropertiesComponent,
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        SharedModule,
        GuidDropdownModule,
    ],
    exports: [...COMPONENTS]
})
export class ImageBeforeUploadModule { }
