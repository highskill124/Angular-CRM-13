import {NgModule} from '@angular/core';
import {IgxExpansionPanelModule, IgxListModule} from 'igniteui-angular';
import {FilterModule} from '../../modules/filter/filter.module';
import {MyTasksComponent} from './components/my-tasks/my-tasks.component';
// import {MyFollowupsComponent} from './components/my-followups/my-followups.component'
import {FilterGridModule} from '../filter-grid/filter-grid.module';



@NgModule({
    declarations: [
        MyTasksComponent,
        //MyFollowupsComponent
    ],
    imports: [
        IgxListModule,
        IgxExpansionPanelModule,
        FilterModule,
        FilterGridModule
    ],
    exports: [
        MyTasksComponent, //MyFollowupsComponent

    ]
})
export class MyStuffGridModule {
}
