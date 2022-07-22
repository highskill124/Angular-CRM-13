import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MessageTrackingGridComponent} from './components/message-tracking-grid/message-tracking-grid.component';
import {MyTasksComponent} from './components/my-tasks/my-tasks.component';
import {MyFollowupsComponent} from './components/my-followups/my-followups.component';

const routes: Routes = [
    {
        path: 'TrackingList',
        component: MessageTrackingGridComponent,
        data: {displayName: 'Message Tracking'},
    },
    {
        path: 'TaskList',
        component: MyTasksComponent,
        data: {displayName: 'My Tasks'},
    },
    {
        path: 'FollowupList',
        component: MyFollowupsComponent,
        data: {displayName: 'My Followups'},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class MyStuffRoutingModule {
}
