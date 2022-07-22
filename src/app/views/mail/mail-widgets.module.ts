import {CreateMailTemplateComponent} from './components/create-mail-template/create-mail-template.component';
import {EditMailTemplateComponent} from './components/edit-mail-template/edit-mail-template.component';
import {QuickMailFormComponent} from './components/quick-mail-form/quick-mail-form.component';
import {NewMessageComponent} from './components/new-message/new-message.component';
import {MassEmailComponent} from './components/mass-email/mass-email.component'
import {NgModule} from '@angular/core';
import {FroalaEditorModule} from 'angular-froala-wysiwyg';
import {CustomAgGridModule} from '../../modules/custom-ag-grid/custom-ag-grid.module';
import {ContactWidgetsModule} from '../contacts/contact-widgets.module';
import {AngularMaterialModule} from '../../modules/angular-material/angular-material.module'
import {EmailTrackingInfoComponent} from './components/email-tracking-info/email-tracking-info.component'
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators'


const COMPONENTS = [
    CreateMailTemplateComponent,
    EditMailTemplateComponent,
    QuickMailFormComponent,
    NewMessageComponent,
    MassEmailComponent,
    EmailTrackingInfoComponent,


];

@NgModule({
    imports: [
        FroalaEditorModule,
        CustomAgGridModule,
        ContactWidgetsModule,
        AngularMaterialModule,
        RxReactiveFormsModule
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS]
})

export class MailWidgetsModule {
}
