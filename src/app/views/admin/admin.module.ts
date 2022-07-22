import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module'
import { AdminGridModule} from './admin-grid.module';
import { MenuEditComponent} from './components/menu-edit/menu-edit.component'
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module'
import { UserMenuPermissionComponent } from './components/user-menu-permission/user-menu-permission.component';
import { KendoModule } from '../../modules/kendo.module';
import {SharedModule} from '../../shared/shared.module';
import {FroalaEditorModule} from 'angular-froala-wysiwyg';



@NgModule({
    imports: [
        AdminGridModule,
        AdminRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        KendoModule,
        SharedModule,
        FroalaEditorModule
    ],
    declarations: [MenuEditComponent, UserMenuPermissionComponent],
    exports: []
})

export class AdminModule {
}
