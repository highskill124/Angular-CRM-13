import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CreateMailTemplateComponent} from './components/create-mail-template/create-mail-template.component';
import {EditMailTemplateComponent} from './components/edit-mail-template/edit-mail-template.component';
import {MailTemplateListComponent} from './components/mail-template-list/mail-template-list.component';
import {NewMessageComponent} from './components/new-message/new-message.component';
import {CampaignListComponent} from './components/campaign-list/campaign-list.component';
import {EmailCampaignComponent} from './components/email-campaign/email-campaign.component';
import {MassEmailComponent} from './components/mass-email/mass-email.component';

const routes: Routes = [
    /*{
      path: 'NewMessage',
      component: CreateMailComponent,
        data: { displayName: 'New Message' },
    },
    {
      path: 'TemplateList',
      component: MailTemplateListComponent,
        data: { displayName: 'Template List' },
    },
    */
    {
        path: 'NewMessage',
        component: NewMessageComponent,
        data: {displayName: 'New Message'},
    },
    {
        path: 'NewTemplate',
        component: CreateMailTemplateComponent,
        data: {displayName: 'New Email Template'},
    },
    {
        path: 'CampaignList',
        component: CampaignListComponent,
        data: {displayName: 'Campaign List'},
    },
    {
        path: 'EmailCampaign/:DocId',
        component: EmailCampaignComponent,
        data: {displayName: 'Email Campaign'},
    },
    {
        path: 'EmailCampaign',
        component: EmailCampaignComponent,
        data: {displayName: 'Email Campaign'},
    },
    {
        path: 'MassEmail',
        component: MassEmailComponent,
        data: {displayName: 'Mass Email'},
    },
    {
        path: 'MailTemplateUpdate/:DocId',
        component: EditMailTemplateComponent,
        data: {displayName: 'Update Email Template'},
    },
    {
        path: 'TemplateList',
        component: MailTemplateListComponent,
        data: {displayName: 'Email Template List'},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MailRoutingModule {
}
