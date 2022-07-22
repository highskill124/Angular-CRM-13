import {NgModule} from '@angular/core';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';
import {AddInteractionComponent} from './components/add-interaction/add-interaction.component';
import {CreateInteractionFormComponent} from './components/create-interaction-form/create-interaction-form.component';
import {AddInteractionActionComponent} from './components/add-interaction-action/add-interaction-action.component';
import {AddInteractionActionDirective} from './directives/add-interaction-action.directive';
import {CreateInteractionComponent} from './components/create-interaction/create-interaction.component';

const ENTRY_COMPONENTS = [
    AddInteractionComponent,
];

const COMPONENTS = [
    CreateInteractionFormComponent,
    AddInteractionActionComponent,
    CreateInteractionComponent,
    ...ENTRY_COMPONENTS,
];

const DIRECTIVES = [
    AddInteractionActionDirective
];

@NgModule({
    imports: [
        CustomAgGridModule,
    ],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    exports: [...COMPONENTS, ...DIRECTIVES]
})

export class InteractionWidgetsModule { }
