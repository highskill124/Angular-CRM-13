import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {FilterComponent} from './components/filter/filter.component';
import {FiltersSidebarContainerComponent} from './components/filters-sidebar/filters-sidebar-container.component';

const ENTRY_COMPONENTS = [
    //
];

const COMPONENTS = [
    ...ENTRY_COMPONENTS,
    FilterComponent,
    FiltersSidebarContainerComponent,
];

const BASE_MODULES = [
    SharedModule,
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [...BASE_MODULES],
    exports: [...COMPONENTS, ...BASE_MODULES]
})
export class FilterModule { }
