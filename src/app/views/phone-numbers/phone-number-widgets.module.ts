import {NgModule} from '@angular/core';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';
import {AddPhoneNumberActionDirective} from './directives/add-phone-number-action.directive';
import {ModalAddPhoneNumberComponent} from './components/modal-add-phone-number/modal-add-phone-number.component';
import {FormCreatePhoneNumberComponent} from './components/form-create-phone-number/form-create-phone-number.component';
import {ActionAddPhoneNumberComponent} from './components/action-add-phone-number/action-add-phone-number.component';
import {PhoneNumbersListComponent} from './components/phone-numbers-list/phone-numbers-list.component';

const ENTRY_COMPONENTS = [
    ModalAddPhoneNumberComponent,
];

const COMPONENTS = [
    FormCreatePhoneNumberComponent,
    ActionAddPhoneNumberComponent,
    PhoneNumbersListComponent,
    ...ENTRY_COMPONENTS,
];

const DIRECTIVES = [
    AddPhoneNumberActionDirective,
];

@NgModule({
    imports: [
        CustomAgGridModule,
    ],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    exports: [...COMPONENTS, ...DIRECTIVES, CustomAgGridModule]
})

export class PhoneNumberWidgetsModule {
}
