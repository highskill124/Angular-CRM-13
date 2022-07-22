import {NgModule} from '@angular/core';
import {HeaderContainerComponent} from './layouts/header-container/header-container.component';
import {SharedModule} from '../../shared/shared.module';
import {CreateQuickContactComponent} from './layouts/create-quick-contact/create-quick-contact.component';
import {CreateQuickMailComponent} from './layouts/create-quick-mail/create-quick-mail.component';
import {ContactWidgetsModule} from '../contacts/contact-widgets.module';
import {MailWidgetsModule} from '../mail/mail-widgets.module';
import {QuickActionsComponent} from './components/quick-actions/quick-actions.component';
import {NotificationsComponent} from './components/notifications/notifications.component';

const ENTRY_COMPONENTS = [
    QuickActionsComponent,
    CreateQuickContactComponent,
    CreateQuickMailComponent,
    NotificationsComponent,
];

const COMPONENTS = [
    ...ENTRY_COMPONENTS,
    HeaderContainerComponent,
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        SharedModule,
        ContactWidgetsModule,
        MailWidgetsModule,
    ],
    exports: [...COMPONENTS]
})

export class QuickActionsModule {
}
