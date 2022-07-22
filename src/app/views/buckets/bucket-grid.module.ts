import {NgModule} from '@angular/core';
import {IgxExpansionPanelModule, IgxListModule} from 'igniteui-angular';
import {FilterModule} from '../../modules/filter/filter.module';
import {BucketGridComponent} from './components/bucket-grid/bucket-grid.component';
import {FilterGridModule} from '../filter-grid/filter-grid.module';
import {TagGridComponent} from '../../views/tags/components/tag-grid/tag-grid.component'


@NgModule({
    declarations: [
        BucketGridComponent,
        TagGridComponent
    ],
    imports: [
        IgxListModule,
        IgxExpansionPanelModule,
        FilterModule,
        FilterGridModule
    ],
    exports: [
        BucketGridComponent, TagGridComponent

    ]
})
export class BucketGridModule {
}
