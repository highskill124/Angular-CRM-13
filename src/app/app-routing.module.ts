import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DocsLayoutComponent } from './components/index/docs-layout.component';
import { IndexComponent } from './components/index/index.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './views/appviews/login/login.component';
import { LogoutComponent } from './views/appviews/logout/logout.component';

export const appRoutes: Routes = [
    // Main redirect
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: '',
        component: IndexComponent,
        canActivate: [AuthGuard],
        children: [
            {
                component: HomeComponent,
                data: { displayName: 'Home' },
                path: 'home',
            },
            {
                component: LogoutComponent,
                data: { displayName: 'Logout' },
                path: 'Logout',
            },
            /*{
                path: 'Leads', component: DocsLayoutComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: 'ListLead',
                        data: { displayName: 'Lead List' },
                        component: LeadListsComponent
                    },
                    {
                        path: 'NewLead',
                        data: { displayName: 'New Lead' },
                        component: CreateLeadComponent
                    },
                    {
                        path: 'Update/:guid',
                        data: { displayName: 'Update Lead' },
                        component: EditLeadComponent
                    },
                ]
            },*/
            {
                path: 'Leads',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('src/app/views/leads/lead.module').then(
                        (m) => m.LeadModule
                    ),
            },

            {
                path: 'Farm',
                loadChildren: () =>
                    import('src/app/views/farms/farms.module').then(
                        (m) => m.FarmsModule
                    ),
            },
            {
                path: 'Vendor',
                loadChildren: () =>
                    import('src/app/views/vendor/vendor.module').then(
                        (m) => m.VendorModule
                    ),
            },
            {
                path: 'DocLibrary',
                loadChildren: () =>
                    import('src/app/views/doc-library/doc-library.module').then(
                        (m) => m.DocLibraryModule
                    ),
            },
            {
                path: 'Emails',
                loadChildren: () =>
                    import('src/app/views/mail/mail.module').then(
                        (m) => m.MailModule
                    ),
            },
            {
                path: 'Contacts',
                loadChildren: () =>
                    import('src/app/views/contacts/contacts.module').then(
                        (m) => m.ContactsModule
                    ),
            },
            {
                path: 'MyStuff',
                loadChildren: () =>
                    import('src/app/views/my-stuff/my-stuff.module').then(
                        (m) => m.MyStuffModule
                    ),
            },
            {
                path: 'Setup',
                loadChildren: () =>
                    import('src/app/views/buckets/bucket.module').then(
                        (m) => m.BucketModule
                    ),
            },
        ],
    },
    {
        path: 'auth',
        component: DocsLayoutComponent,
        children: [
            {
                path: '',
                component: LoginComponent,
            },
            {
                path: 'login',
                component: LoginComponent,
            },
        ],
    },

    // // TODO: remove filter grid links
    // {
    //     path: 'filter-grid',

    //     component: FilterGridTest2Component,
    //     canActivate: [AuthGuard],
    // },

    // {
    //     path: 'filter-grid-1',

    //     component: FilterGridTest1Component,
    //     canActivate: [AuthGuard],
    // },

    // Handle all other routes
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forRoot(appRoutes, {
            onSameUrlNavigation: 'reload',
        }),
    ],
})
export class AppRoutingModule {}
