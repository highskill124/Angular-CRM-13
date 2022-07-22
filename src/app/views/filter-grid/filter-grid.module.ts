import {NgModule} from '@angular/core';
import {FilterGridComponent} from './components/filter-grid/filter-grid.component';
import {IgxExpansionPanelModule, IgxListModule} from 'igniteui-angular';
import {FilterModule} from '../../modules/filter/filter.module';
import {InteractionWidgetsModule} from '../interactions/interaction-widgets.module';
import {NoteWidgetsModule} from '../notes/note-widgets.module';
import {FollowupWidgetsModule} from '../followups/followup-widgets.module';
import {TaskWidgetsModule} from '../tasks/task-widgets.module';
import {PhoneNumberWidgetsModule} from '../phone-numbers/phone-number-widgets.module';
import {EmailWidgetsModule} from '../emails/email-widgets.module';
import {BucketWidgetsModule} from '../buckets/bucket-widgets.module';
import {ListWidgetsModule} from '../lists/list-widgets.module';
import {FilterGridActionsComponent} from './components/filter-grid-actions/filter-grid-actions.component';
import {EmailTemplateListComponent} from './components/email-template-list/email-template-list.component'

@NgModule({
    declarations: [
        FilterGridComponent,
        FilterGridActionsComponent,
        EmailTemplateListComponent
    ],
    imports: [
        IgxListModule,
        IgxExpansionPanelModule,
        // ??
        FilterModule,
        InteractionWidgetsModule,
        NoteWidgetsModule,
        FollowupWidgetsModule,
        TaskWidgetsModule,
        PhoneNumberWidgetsModule,
        EmailWidgetsModule,
        BucketWidgetsModule,
        ListWidgetsModule,
    ],
    exports: [
        FilterGridComponent,
        FilterGridActionsComponent,
        EmailTemplateListComponent
    ]
})
export class FilterGridModule {
}
