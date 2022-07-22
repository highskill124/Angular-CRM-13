import {NgModule} from '@angular/core';
import {ContactsRoutingModule} from './contacts-routing.module';
import {ContactWidgetsModule} from './contact-widgets.module';

@NgModule({
    imports: [
        ContactsRoutingModule,
        ContactWidgetsModule,
    ],
})

export class ContactsModule {
}
