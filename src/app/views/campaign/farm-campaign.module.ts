import {NgModule} from '@angular/core';
import {FarmCampaignListsComponent} from './components/farm-campaign-lists/farm-campaign-lists.component';
import {CreateFarmCampaignComponent} from './components/create-farm-campaign/create-farm-campaign.component';
import {EditFarmCampaignComponent} from './components/edit-farm-campaign/edit-farm-campaign.component';
import {FarmCampaignRoutingModule} from './farm-campaign-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {InfragisticsGridModule} from '../../modules/infragistics-grid/infragistics-grid.module';

const COMPONENTS = [
    FarmCampaignListsComponent,
    CreateFarmCampaignComponent,
    EditFarmCampaignComponent,
];

@NgModule({
    imports: [
        FarmCampaignRoutingModule,
        InfragisticsGridModule,
        SharedModule,
    ],
    declarations: [...COMPONENTS]
})

export class FarmCampaignModule {
}
