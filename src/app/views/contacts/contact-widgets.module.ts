import {AddEmailComponent} from './components/add-email/add-email.component';
import {FormAddEmailNewContactComponent} from './components/add-email/form-email-new-contact/form-add-email-new-contact.component';
import {FormAddEmailExistingContactComponent} from './components/add-email/form-add-email-existing-contact/form-add-email-existing-contact.component';
import {QuickContactFormComponent} from './components/quick-contact-form/quick-contact-form.component';
import {CreateContactComponent} from './components/create-contact/create-contact.component';
import {ViewContactComponent} from './components/view-contact/view-contact.component';
import {ViewContactWrapperComponent} from './components/view-contact/wrapper/view-contact-wrapper.component';
import {EditContactComponent} from './components/edit-contact/edit-contact.component';
import {ContactsListComponent} from './components/contacts-list/contacts-list.component';
import {FiltersSidebarComponent} from './components/filters-sidebar/filters-sidebar.component';
import {ContactTagsEditorComponent} from './components/tags-editor/contact-tags-editor.component';
import {ContactBucketsEditorComponent} from './components/buckets-editor/contact-buckets-editor.component';
import {NgModule} from '@angular/core';
import {MapsModule} from '../../modules/maps/maps.module';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';
import {ContactConnectionModule} from '../contact-connection/contact-connection.module';
import {MailsListModule} from '../mail/components/mails-list/mails-list.module';
import {InteractionWidgetsModule} from '../interactions/interaction-widgets.module';
import {RouterModule} from '@angular/router';
import {NoteWidgetsModule} from '../notes/note-widgets.module';
import {TaskWidgetsModule} from '../tasks/task-widgets.module';
import {FollowupWidgetsModule} from '../followups/followup-widgets.module';
import {PhoneNumberWidgetsModule} from '../phone-numbers/phone-number-widgets.module';
import {EmailWidgetsModule} from '../emails/email-widgets.module';
import {FilterModule} from '../../modules/filter/filter.module';
import {SharedGridGridModule} from '../shared-grids/shared-grids-grid.module'

const ENTRY_COMPONENTS = [
    AddEmailComponent,
    FormAddEmailNewContactComponent,
    FormAddEmailExistingContactComponent,
];

const COMPONENTS = [
    QuickContactFormComponent,
    CreateContactComponent,
    ViewContactComponent,
    ViewContactWrapperComponent,
    EditContactComponent,
    ContactsListComponent,
    FiltersSidebarComponent,
    ContactTagsEditorComponent,
    ContactBucketsEditorComponent,
    ...ENTRY_COMPONENTS,
];

@NgModule({
    imports: [
        RouterModule,
        MapsModule,
        CustomAgGridModule,
        InteractionWidgetsModule,
        NoteWidgetsModule,
        TaskWidgetsModule,
        FollowupWidgetsModule,
        PhoneNumberWidgetsModule,
        EmailWidgetsModule,
        ContactConnectionModule,
        MailsListModule,
        FilterModule,
        SharedGridGridModule
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS]
})

export class ContactWidgetsModule {
}
