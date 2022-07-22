import {NgModule} from '@angular/core';
import {MailRoutingModule} from './mail-routing.module';
import {MailWidgetsModule} from './mail-widgets.module';
import {MailGridModule} from './mail-grid.module'

@NgModule({
    imports: [
        MailRoutingModule,
        MailWidgetsModule,
        MailGridModule
    ],
})

export class MailModule {
}
