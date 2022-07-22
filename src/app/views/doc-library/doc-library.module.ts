import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {InfragisticsModule} from '../../modules/infragistics/infragistics.module';
import {DocUploadComponent} from './components/doc-upload/doc-upload.component';
import {DocLibraryRoutingModule} from './doc-library-routing.module';
import {FileUploadModule} from 'ng2-file-upload';
import {AngularMaterialModule} from '../../modules/angular-material/angular-material.module';
import {DocUploadFormComponent} from './components/doc-upload-form/doc-upload-form.component';

const COMPONENTS = [
    DocUploadComponent,
    DocUploadFormComponent
];

@NgModule({
    imports: [
        DocLibraryRoutingModule,
        InfragisticsModule,
        AngularMaterialModule,
        SharedModule,
        FileUploadModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})

export class DocLibraryModule {
}
