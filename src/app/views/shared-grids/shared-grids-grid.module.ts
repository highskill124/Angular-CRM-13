import {NgModule} from '@angular/core';
import {IgxExpansionPanelModule, IgxListModule} from 'igniteui-angular';
import {FilterModule} from '../../modules/filter/filter.module';
import {FilterGridModule} from '../filter-grid/filter-grid.module';
import {SharedFollowUpComponent} from './components/shared-follow-ups/shared-follow-up.component'
import {SharedInteractionsComponent} from './components/shared-interactions/shared-interactions.component'
import { SharedTasksComponent } from './components/shared-tasks/shared-tasks.component';
import { SharedEmailsComponent } from './components/shared-emails/shared-emails.component';
import {SharedNotesComponent } from './components/shared-notes/shared-notes.component';


@NgModule({
    declarations: [
        SharedFollowUpComponent,
        SharedInteractionsComponent,
        SharedTasksComponent,
        SharedEmailsComponent,
        SharedNotesComponent
    ],
    imports: [
        IgxListModule,
        IgxExpansionPanelModule,
        FilterModule,
        FilterGridModule
    ],
    exports: [
        SharedFollowUpComponent,
        SharedInteractionsComponent,
        SharedTasksComponent,
        SharedEmailsComponent,
        SharedNotesComponent
    ]
})
export class SharedGridGridModule {
}
