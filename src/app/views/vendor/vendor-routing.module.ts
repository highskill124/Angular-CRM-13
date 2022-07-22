import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CreateVendorComponent} from './components/create-vendor/create-vendor.component';
import {VendorListComponent} from './components/vendor-list/vendor-list.component';
import {EditVendorComponent} from './components/edit-vendor/edit-vendor.component';

const routes: Routes = [
    {
        path: 'VendorAdd',
        component: CreateVendorComponent,
        data: {displayName: 'Add Vendor'},
    },
    {
        path: 'VendorList',
        component: VendorListComponent,
        data: {displayName: 'Vendor List'},
    },
    {
        path: 'Update/:VendorID',
        component: EditVendorComponent,
        data: {displayName: 'Update Vendor'},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VendorRoutingModule {
}
