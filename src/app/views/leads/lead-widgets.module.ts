import {NgModule} from '@angular/core';
import {DivorceLeadFiltersSidebarComponent} from './components/filters-sidebar/divorce-lead-filters-sidebar.component';
import {DivorceLeadsComponent} from './components/divorce-leads/divorce-leads.component';
import {CreateLeadComponent} from './components/create-lead/create-lead.component';
import {EditLeadComponent} from './components/edit-lead/edit-lead.component';
import {LeadFormComponent} from './components/lead-form/lead-form.component';
import {LeadListsComponent} from './components/lead-lists/lead-lists.component';
import {AppviewsModule} from '../appviews/appviews.module';
import {InteractionWidgetsModule} from '../interactions/interaction-widgets.module';
import {NoteWidgetsModule} from '../notes/note-widgets.module';
import {TaskWidgetsModule} from '../tasks/task-widgets.module';
import {FollowupWidgetsModule} from '../followups/followup-widgets.module';
import {PhoneNumberWidgetsModule} from '../phone-numbers/phone-number-widgets.module';
import {EmailWidgetsModule} from '../emails/email-widgets.module';

const ENTRY_COMPONENTS = [
    //
];

const COMPONENTS = [
    DivorceLeadFiltersSidebarComponent,
    DivorceLeadsComponent,
    CreateLeadComponent,
    EditLeadComponent,
    LeadFormComponent,
    LeadListsComponent,
    ...ENTRY_COMPONENTS,
];

const BASE_MODULES = [
    InteractionWidgetsModule,
    NoteWidgetsModule,
    TaskWidgetsModule,
    FollowupWidgetsModule,
    PhoneNumberWidgetsModule,
    EmailWidgetsModule,
    AppviewsModule,
];

@NgModule({
    imports: [
        ...BASE_MODULES,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS, ...BASE_MODULES]
})

export class LeadWidgetsModule {
}
