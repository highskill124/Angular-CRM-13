import {NgModule} from '@angular/core';
import {IgxExpansionPanelModule, IgxListModule} from 'igniteui-angular';
import {FilterModule} from '../../modules/filter/filter.module';
import {MailTemplateListComponent} from './components/mail-template-list/mail-template-list.component';
import {FilterGridModule} from '../filter-grid/filter-grid.module';
import {CampaignListComponent} from './components/campaign-list/campaign-list.component';
import {EmailCampaignComponent} from './components/email-campaign/email-campaign.component';
import {AngularMaterialModule} from './../../modules/angular-material/angular-material.module'


@NgModule({
    declarations: [
        MailTemplateListComponent,
        CampaignListComponent,
        EmailCampaignComponent
    ],
    imports: [
        IgxListModule,
        IgxExpansionPanelModule,
        FilterModule,
        FilterGridModule,
        AngularMaterialModule
    ],
    exports: [
        MailTemplateListComponent,
        CampaignListComponent,
        EmailCampaignComponent

    ]
})
export class MailGridModule {
}
