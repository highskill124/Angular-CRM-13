import {NgModule} from '@angular/core';
import {SharedGridGridModule} from './shared-grids-grid.module';
import {SharedGrididgetsModule} from './shared-grids-widget.module';

@NgModule({
    imports: [
        SharedGridGridModule,
        SharedGrididgetsModule

    ],
})

export class SharedGridModule {
}
