import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ContactsListComponent} from './components/contacts-list/contacts-list.component';
import {CreateContactComponent} from './components/create-contact/create-contact.component';
import {EditContactComponent} from './components/edit-contact/edit-contact.component';
import {ViewContactWrapperComponent} from './components/view-contact/wrapper/view-contact-wrapper.component';
import {MainContactResolver} from '../../resolvers/main-contact-resolver.service';

const routes: Routes = [
    {
        path: 'ContactUpdate/:DocId',
        component: EditContactComponent,
        data: {displayName: 'Update Contact'},
    },
    {
        path: 'ContactDetails/:DocId',
        component: ViewContactWrapperComponent,
        resolve: {'contactResponse': MainContactResolver},
        data: {displayName: 'Contact Details'},
    },
    {
        path: 'NewContact',
        component: CreateContactComponent,
        data: {displayName: 'New Contact'},
    },
    {
        path: 'ContactList',
        component: ContactsListComponent,
        data: {displayName: 'Contact List'},
    },
    /*{
      path: 'Update/:DocId',
      component: EditFarmCampaignComponent,
      data: { displayName: 'Update Campaign' },
      canDeactivate: [CanDeactivateGuard],
    },*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ContactsRoutingModule {
}
