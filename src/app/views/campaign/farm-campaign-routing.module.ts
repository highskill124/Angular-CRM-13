import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CreateFarmCampaignComponent} from './components/create-farm-campaign/create-farm-campaign.component';
import {FarmCampaignListsComponent} from './components/farm-campaign-lists/farm-campaign-lists.component';
import {CampaignWizardComponent} from './components/campaign-wizard/campaign-wizard.component'
import {EditFarmCampaignComponent} from './components/edit-farm-campaign/edit-farm-campaign.component';
import {CanDeactivateGuard} from '../../guards/can-deactivate/can-deactivate.guard';

const routes: Routes = [
    {
        path: 'CampaignLink2',
        component: CreateFarmCampaignComponent,
        data: {displayName: 'New Campaign'},
        canDeactivate: [CanDeactivateGuard],
    },
    {
        path: 'CampaignLink3',
        component: FarmCampaignListsComponent,
        data: {displayName: 'Campaign List'},
    },
    {
        path: 'Update/:CampaignID',
        component: EditFarmCampaignComponent,
        data: {displayName: 'Update Campaign'},
        canDeactivate: [CanDeactivateGuard],
    },
    {
        path: 'CampaignWizzard',
        component: CampaignWizardComponent,
        data: {displayName: 'Campaign Wizzard'},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FarmCampaignRoutingModule {
}
