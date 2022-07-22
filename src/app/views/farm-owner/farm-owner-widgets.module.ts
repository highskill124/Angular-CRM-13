import {NgModule} from '@angular/core';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';
import {AddFarmOwnerActionDirective} from './directives/add-farm-owner-action.directive';
import {FormCreateFarmOwnerComponent} from './components/form-create-farm-owner/form-create-farm-owner.component';
import {ModalAddFarmOwnerComponent} from './components/modal-add-farm-owner/modal-add-farm-owner.component';
import {ActionAddFarmOwnerComponent} from './components/action-add-farm-owner/action-add-farm-owner.component';
import {ViewFarmOwnerComponent} from './components/view-farm-owner/view-farm-owner.component';

const ENTRY_COMPONENTS = [
    ModalAddFarmOwnerComponent,
];

const COMPONENTS = [
    FormCreateFarmOwnerComponent,
    ActionAddFarmOwnerComponent,
    ViewFarmOwnerComponent,
    ...ENTRY_COMPONENTS,
];

const DIRECTIVES = [
    AddFarmOwnerActionDirective,
];

@NgModule({
    imports: [
        CustomAgGridModule,
    ],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    exports: [...COMPONENTS, ...DIRECTIVES, CustomAgGridModule]
})

export class FarmOwnerWidgetsModule {
}
