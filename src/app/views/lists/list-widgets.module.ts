import {NgModule} from '@angular/core';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';
import {ListModalComponent} from './components/list-modal/list-modal.component';
import {ListFormComponent} from './components/list-form/list-form.component';
import {SharedModule} from '../../shared/shared.module';
import {ListActionDirective} from './directives/list-action.directive';
import {ListActionComponent} from './components/list-action/list-action.component';


const ENTRY_COMPONENTS = [
    ListModalComponent,
];

const COMPONENTS = [
    ListFormComponent,
    ListActionComponent,
    ...ENTRY_COMPONENTS,
];

const DIRECTIVES = [
    ListActionDirective,
];

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    exports: [...COMPONENTS, ...DIRECTIVES, CustomAgGridModule]
})

export class ListWidgetsModule { }
