import {NgModule} from '@angular/core';
import {MyStuffRoutingModule} from './my-stuff-routing.module';
import {MyStuffWidgetsModule} from './my-stuff-widgets.module';
import {MyStuffGridModule} from './my-stuff-grid.module';

@NgModule({
    imports: [
        MyStuffRoutingModule,
        MyStuffWidgetsModule,
        MyStuffGridModule,

    ],
})

export class MyStuffModule {
}



