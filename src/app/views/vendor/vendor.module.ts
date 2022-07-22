import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {InfragisticsModule} from '../../modules/infragistics/infragistics.module';
import {InfragisticsGridModule} from '../../modules/infragistics-grid/infragistics-grid.module';
import {VendorListComponent} from './components/vendor-list/vendor-list.component';
import {CreateVendorComponent} from './components/create-vendor/create-vendor.component';
import {EditVendorComponent} from './components/edit-vendor/edit-vendor.component';
import {VendorRoutingModule} from './vendor-routing.module';
import {MapsModule} from '../../modules/maps/maps.module';

const COMPONENTS = [
    VendorListComponent,
    CreateVendorComponent,
    EditVendorComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        VendorRoutingModule,
        InfragisticsModule,
        InfragisticsGridModule,
        SharedModule,
        MapsModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})

export class VendorModule {
}
