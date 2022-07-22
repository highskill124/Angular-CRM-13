import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DivorceLeadsComponent} from './components/divorce-leads/divorce-leads.component';
import {LeadListsComponent} from './components/lead-lists/lead-lists.component';
import {CreateLeadComponent} from './components/create-lead/create-lead.component';
import {EditLeadComponent} from './components/edit-lead/edit-lead.component';

const routes: Routes = [
    {
        path: 'ListLead',
        data: {displayName: 'Lead List'},
        component: LeadListsComponent
    },
    {
        path: 'NewLead',
        data: {displayName: 'New Lead'},
        component: CreateLeadComponent
    },
    {
        path: 'Update/:guid',
        data: {displayName: 'Update Lead'},
        component: EditLeadComponent
    },
    {
        path: 'DivorceLeads',
        component: DivorceLeadsComponent,
        data: {displayName: 'Divorce Leads'},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class LeadRoutingModule {
}
