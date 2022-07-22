import {NgModule} from '@angular/core';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';
import {RouterModule} from '@angular/router';
import {MessageTrackingFiltersSidebarComponent} from './components/filters-sidebar/message-tracking-filters-sidebar.component';
import {MessageTrackingGridComponent} from './components/message-tracking-grid/message-tracking-grid.component';
import {TaskWidgetsModule} from '../tasks/task-widgets.module';
import {FollowupWidgetsModule} from '../followups/followup-widgets.module';


const ENTRY_COMPONENTS = [
    //
];

const COMPONENTS = [
    MessageTrackingFiltersSidebarComponent,
    MessageTrackingGridComponent,
    
    ...ENTRY_COMPONENTS,
];

@NgModule({
    imports: [
        RouterModule,
        TaskWidgetsModule,
        FollowupWidgetsModule,
        CustomAgGridModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS]
})

export class MyStuffWidgetsModule {
}
