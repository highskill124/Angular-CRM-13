import {NgModule} from '@angular/core';
import {MailsListComponent} from './mails-list.component';
import {CustomAgGridModule} from '../../../../modules/custom-ag-grid/custom-ag-grid.module';

const COMPONENTS = [
    MailsListComponent,
];

const BASE_MODULES = [
    CustomAgGridModule,
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        BASE_MODULES,
    ],
    exports: [
        ...COMPONENTS,
        BASE_MODULES,
    ]
})
export class MailsListModule {
}
