import {NgModule} from '@angular/core';
import {BucketWidgetsModule} from './bucket-widgets.module';
import {BucketRoutingModule} from './bucket-routing.module'
import {BucketGridModule} from './bucket-grid.module';

@NgModule({
    imports: [
        BucketGridModule,
        BucketWidgetsModule,
        BucketRoutingModule,
    ],
    declarations: [],
    exports: [],
})

export class BucketModule {
}
