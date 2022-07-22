import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MenuGridComponent} from './components/menu-grid/menu-grid.component';
import {UserEditComponent} from './components/user-edit/user-edit.component'
import {UserMenuPermissionComponent } from './components/user-menu-permission/user-menu-permission.component';
import { UserListComponent } from './components/user-list/user-list.component';
import {GridDefinitionListComponent} from './components/grid-definition-list/grid-definition-list.component'


const routes: Routes = [
    {
        path: 'MenuItemList',
        component: MenuGridComponent,
        data: {displayName: 'Menu Item List'},
    },
    {
        path: 'UserEdit',
        component: UserEditComponent,
        data: {displayName: 'User Edit'},
    },
    {
        path: 'UserMenuPermission',
        component: UserMenuPermissionComponent ,
        data: {displayName: 'User Menu Permission'},
    },
    {
        path: 'UserList',
        component: UserListComponent ,
        data: {displayName: 'User Account List'},
    },
    {
        path: 'GridDefinition',
        component: GridDefinitionListComponent ,
        data: {displayName: 'Grid Definition List'},
    },






 



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AdminRoutingModule {
}
