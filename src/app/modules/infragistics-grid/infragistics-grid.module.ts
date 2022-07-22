import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IgxCsvExporterService, IgxExcelExporterService} from 'igniteui-angular';
import {IgGridComponent} from './grid-infragistics/ig-grid.component';
import {InfragisticsModule} from '../infragistics/infragistics.module';
import {IgGridTestComponent} from './grid-infragistics-test/ig-grid-test.component';

const COMPONENTS = [
    IgGridComponent,
    IgGridTestComponent,
];

const BASE_MODULES = [
    CommonModule,
    InfragisticsModule,
];

@NgModule({
    imports: [
        ...BASE_MODULES,
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
        ...BASE_MODULES,
    ],
    providers: [
        IgxExcelExporterService,
        IgxCsvExporterService,
    ],
})
export class InfragisticsGridModule {
}
