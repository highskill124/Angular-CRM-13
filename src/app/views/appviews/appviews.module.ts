import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {GridComponent} from './grid/grid.component';
import {GridColumnsToggleComponent} from './grid/columns-toggle/grid-columns-toggle.component';
import {InfragisticsGridModule} from '../../modules/infragistics-grid/infragistics-grid.module';
import {AngularMaterialModule} from '../../modules/angular-material/angular-material.module';
import {LogoutComponent} from './logout/logout.component';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';

const BASE_MODULES = [
    AngularMaterialModule,
    InfragisticsGridModule,
    CustomAgGridModule,
];

@NgModule({
    declarations: [
        LoginComponent,
        GridColumnsToggleComponent,
        GridComponent,
        LogoutComponent,
    ],
    imports: [
        RouterModule,
        ...BASE_MODULES,
    ],
    exports: [
        LoginComponent,
        GridComponent,
        ...BASE_MODULES,
    ]
})

export class AppviewsModule {
}
