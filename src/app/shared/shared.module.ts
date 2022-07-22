import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormatPhoneNumberDirective} from './directives/format-phone-number.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InfragisticsModule} from '../modules/infragistics/infragistics.module';
import {DropdownSelectComponent} from './components/dropdown-select/dropdown-select.component';
import {ChipsSelectComponent} from './components/chips-select/chips-select.component';
import {MultiSelectBoxModule} from '../modules/multi-select-box/multi-select-box.module';
import {EmailFilterPipe} from './pipes/email-filter.pipe';
import {ChipsAutocompleteSelectComponent} from './components/chips-autocomplete-select/chips-autocomplete-select.component';
import {DismissibleContainerComponent} from './components/dismissable-container/dismissible-container.component';
import {InputAutocompleteSelectComponent} from './components/input-autocomplete-select/input-autocomplete-select.component';
import {GooglePlacesDirective} from './directives/google-places.directive';
import {DropdownComponent} from './components/dropdown/dropdown.component';
import {DateInputComponent} from './components/date-input/date-input.component';
import {DebounceInputDirective} from './directives/debounce-input.directive';
import {PreventDoubleClickDirective } from './directives/prevent-double-click.directive'
import {AngularMaterialModule} from '../modules/angular-material/angular-material.module'


import {GuidDropdownComponent} from './components/guid-dropdown/guid-dropdown.component';
import {DataExportActionComponent} from './components/data-export-action/data-export-action.component';
import {DataExportDialogComponent} from './components/data-export-modal/data-export-dialog.component';
import {MatTableDynamicModule } from './mat-table-dynamic/mat-table-dynamic.module';
import {FroalaEditorModule} from 'angular-froala-wysiwyg';
import { ButtonToggleComponent } from './components/button-toggle/button-toggle.component';
import { MatSelectAllComponent } from './components/mat-select-all/mat-select-all.component';
import { OptionFilterPipe } from './pipes/option-filter.pipe';
import {RxReactiveFormsModule} from '@rxweb/reactive-form-validators';

const DIRECTIVES = [
    FormatPhoneNumberDirective,
    GooglePlacesDirective,
    DebounceInputDirective,
    PreventDoubleClickDirective,
];

const PIPES = [
    EmailFilterPipe,

];

const COMPONENTS = [
    DropdownSelectComponent,
    ChipsSelectComponent,
    ChipsAutocompleteSelectComponent,
    InputAutocompleteSelectComponent,
    DismissibleContainerComponent,
    GuidDropdownComponent,
    DropdownComponent,
    DateInputComponent,
    DataExportActionComponent,
    DataExportDialogComponent,
    ButtonToggleComponent,
    MatSelectAllComponent
];

const BASE_MODULES = [
    CommonModule,
    FormsModule,
    FroalaEditorModule,
    ReactiveFormsModule,
    InfragisticsModule,
    AngularMaterialModule,
    MultiSelectBoxModule,
    MatTableDynamicModule
];

@NgModule({
    imports: [
        ...BASE_MODULES,
        RxReactiveFormsModule
    ],
    declarations: [...DIRECTIVES, ...COMPONENTS, ...PIPES],
    exports: [...DIRECTIVES, ...COMPONENTS, ...BASE_MODULES, ...PIPES],
})
export class SharedModule {
}
