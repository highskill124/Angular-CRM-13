import {NgModule} from '@angular/core';
import {LeadRoutingModule} from './lead-routing.module';
import {LeadWidgetsModule} from './lead-widgets.module';

@NgModule({
    imports: [
        LeadRoutingModule,
        LeadWidgetsModule,
    ],
})

export class LeadModule {
}
