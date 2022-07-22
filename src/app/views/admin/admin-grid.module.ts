import {NgModule} from '@angular/core';
import {IgxExpansionPanelModule, IgxListModule} from 'igniteui-angular';
import {FilterModule} from '../../modules/filter/filter.module';
import {MenuGridComponent} from './components/menu-grid/menu-grid.component';
import {FilterGridModule} from '../filter-grid/filter-grid.module';
import {UserEditComponent} from './components/user-edit/user-edit.component'
import {AngularMaterialModule} from './../../modules/angular-material/angular-material.module'
import {UserListComponent} from './components/user-list/user-list.component'
import {UserQuickEditComponent } from './components/user-quick-edit/user-quick-edit.component';
import {GridDefinitionListComponent} from './components/grid-definition-list/grid-definition-list.component'
import {GridColunEditorComponent} from './components/grid-column-editor/grid-column-editor.component'

// import { PasswordComponent } from '../../views/admin/components/password/password.component'


@NgModule({
    declarations: [
        MenuGridComponent,
        UserEditComponent,
        UserListComponent,
        UserQuickEditComponent,
        GridDefinitionListComponent,
        GridColunEditorComponent


    ],
    imports: [
        IgxListModule,
        IgxExpansionPanelModule,
        FilterModule,
        FilterGridModule,
        AngularMaterialModule
    ],
    exports: [
        MenuGridComponent,
        UserEditComponent,
        UserListComponent,
        

    ],

})
export class AdminGridModule {
}
