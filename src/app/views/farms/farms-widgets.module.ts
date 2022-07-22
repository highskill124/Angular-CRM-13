import {NgModule} from '@angular/core';
import {FarmListsTestComponent} from './components/farm-lists-test/farm-lists-test.component';
import {FarmListsComponent} from './components/farm-lists/farm-lists.component';
import {FarmsListAgGridComponent} from './components/farms-list-ag-grid/farms-list-ag-grid.component';
import {UploadComponent} from './components/file-upload/upload.component';
import {InfragisticsGridModule} from '../../modules/infragistics-grid/infragistics-grid.module';
import {FarmsListFiltersSidebarComponent} from './components/farms-filters-sidebar/farms-list-filters-sidebar.component';
import {InteractionWidgetsModule} from '../interactions/interaction-widgets.module';
import {NoteWidgetsModule} from '../notes/note-widgets.module';
import {TaskWidgetsModule} from '../tasks/task-widgets.module';
import {FollowupWidgetsModule} from '../followups/followup-widgets.module';
import {PhoneNumberWidgetsModule} from '../phone-numbers/phone-number-widgets.module';
import {EmailWidgetsModule} from '../emails/email-widgets.module';
import {FarmMasterWrapperComponent} from './components/farm-master/wrapper/farm-master-wrapper.component';
import {FarmMasterComponent} from './components/farm-master/farm-master.component';
import {MailWidgetsModule} from '../mail/mail-widgets.module';
import {MailsListModule} from '../mail/components/mails-list/mails-list.module';
import {BucketWidgetsModule} from '../buckets/bucket-widgets.module';
import {FilterModule} from '../../modules/filter/filter.module';
import {FarmOwnerWidgetsModule} from '../farm-owner/farm-owner-widgets.module';
import {ListWidgetsModule} from '../lists/list-widgets.module';
import {SharedGridGridModule} from '../shared-grids/shared-grids-grid.module'
import {AngularMaterialModule} from './../../modules/angular-material/angular-material.module'
import {NewFarmListsComponent } from './components/new-farm-list/new-farm-list.component';
import {FilterGridModule} from '../filter-grid/filter-grid.module';


const ENTRY_COMPONENTS = [
    //
];

const COMPONENTS = [
    FarmListsTestComponent,
    FarmListsComponent,
    FarmsListAgGridComponent,
    FarmsListFiltersSidebarComponent,
    UploadComponent,
    FarmMasterWrapperComponent,
    FarmMasterComponent,
    NewFarmListsComponent,
    ...ENTRY_COMPONENTS,
];

const DIRECTIVES = [
    //
];

const BASE_MODULES = [
    InfragisticsGridModule,
    InteractionWidgetsModule,
    NoteWidgetsModule,
    TaskWidgetsModule,
    FollowupWidgetsModule,
    PhoneNumberWidgetsModule,
    EmailWidgetsModule,
    MailsListModule,
    MailWidgetsModule,
    BucketWidgetsModule,
    FarmOwnerWidgetsModule,
    FilterModule,
    ListWidgetsModule,
    AngularMaterialModule
];

@NgModule({
    imports: [
        SharedGridGridModule,
        FilterGridModule,
        ...BASE_MODULES,
    ],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    exports: [...COMPONENTS, ...DIRECTIVES, ...BASE_MODULES]
})

export class FarmsWidgetsModule {
}
