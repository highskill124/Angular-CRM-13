import {NgModule} from '@angular/core';
import {BucketActionDirective} from './directives/bucket-action.directive';
import {BucketFormComponent} from './components/bucket-form/bucket-form.component';
import {BucketModalComponent} from './components/bucket-modal/bucket-modal.component';
import {BucketActionComponent} from './components/bucket-action/bucket-action.component';
import {SharedModule} from '../../shared/shared.module';

const ENTRY_COMPONENTS = [
    BucketModalComponent,
];

const COMPONENTS = [
    BucketFormComponent,
    BucketActionComponent,
    ...ENTRY_COMPONENTS,
];

const DIRECTIVES = [
    BucketActionDirective,
];

const BASE_MODULES = [
    SharedModule,
];

@NgModule({
    imports: [...BASE_MODULES],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    exports: [...COMPONENTS, ...DIRECTIVES, ...BASE_MODULES]
})

export class BucketWidgetsModule {
}
