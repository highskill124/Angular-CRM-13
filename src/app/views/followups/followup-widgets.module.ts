import { NgModule } from '@angular/core';
import { CustomAgGridModule } from '../../modules/custom-ag-grid/custom-ag-grid.module';
import { AddFollowupActionDirective } from './directives/add-followup-action.directive';
import { FormCreateFollowupComponent } from './components/form-create-followup/form-create-followup.component';
import { ActionAddFollowupComponent } from './components/action-add-followup/action-add-followup.component';
import { FollowupsListComponent } from './components/followups-list/followups-list.component';
import { ModalAddFollowupComponent } from './components/modal-add-followup/modal-add-followup.component';
import { DialogService } from '../../services/dialog.service';
import { CreateFollowUpComponent } from './components/create-followup/create-followup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxRippleModule, IgxButtonModule } from 'igniteui-angular';
const ENTRY_COMPONENTS = [
    ModalAddFollowupComponent,
];
const COMPONENTS = [
    FormCreateFollowupComponent,
    CreateFollowUpComponent,
    ActionAddFollowupComponent,
    FollowupsListComponent,
    ...ENTRY_COMPONENTS,
];
const DIRECTIVES = [
    AddFollowupActionDirective,
];
@NgModule({
    imports: [
        CustomAgGridModule,
        // BrowserAnimationsModule,
        IgxRippleModule,
        IgxButtonModule
    ],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    exports: [...COMPONENTS, ...DIRECTIVES, CustomAgGridModule],
    providers: [DialogService]
})
export class FollowupWidgetsModule {
}
