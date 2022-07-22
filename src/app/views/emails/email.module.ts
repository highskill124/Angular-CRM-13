import {NgModule} from '@angular/core';
import {EmailWidgetsModule} from './email-widgets.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
    imports: [
        EmailWidgetsModule,
        NgxJsonViewerModule,
    ],
    declarations: [],
    exports: [],
})

export class EmailModule {
}
