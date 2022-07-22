import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {FormCreateConnectionComponent} from './components/form-create-connection/form-create-connection.component';
import {ModalAddConnectionComponent} from './components/modal-add-connection/modal-add-connection.component';
import {ActionAddConnectionComponent} from './components/action-add-connection/action-add-connection.component';

const ENTRY_COMPONENTS = [
    ModalAddConnectionComponent,
];

const COMPONENTS = [
    FormCreateConnectionComponent,
    ActionAddConnectionComponent,
    ...ENTRY_COMPONENTS,
];

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS, SharedModule]
})

export class ContactConnectionModule {
}
