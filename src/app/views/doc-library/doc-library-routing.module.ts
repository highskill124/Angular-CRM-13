import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DocUploadComponent} from './components/doc-upload/doc-upload.component';

const routes: Routes = [
    {
        path: 'DocUpload',
        component: DocUploadComponent,
        data: {displayName: 'Upload Document'},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DocLibraryRoutingModule {
}
