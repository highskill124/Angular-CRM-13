import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MultiSelectBoxComponent} from './components/multi-select-box/multi-select-box.component';
import {InfragisticsModule} from '../infragistics/infragistics.module';
import {MultiSelectBoxCardComponent} from './components/multi-select-box-card/multi-select-box-card.component';
import { OptionFilterPipe } from '../../shared/pipes/option-filter.pipe';

const ENTRY_COMPONENTS = [];
const COMPONENTS = [
    ...ENTRY_COMPONENTS,
    MultiSelectBoxComponent,
    MultiSelectBoxCardComponent,
    OptionFilterPipe
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        CommonModule,
        InfragisticsModule,
    ],
    exports: [...COMPONENTS]
})
export class MultiSelectBoxModule {
}
