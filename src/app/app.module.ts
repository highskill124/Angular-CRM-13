import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppviewsModule} from './views/appviews/appviews.module';
import {InfragisticsModule} from './modules/infragistics/infragistics.module';
import {ToasterModule} from 'angular2-toaster';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {AuthGuard} from './guards/auth.guard';
import {AngularMaterialModule} from './modules/angular-material/angular-material.module';
import {HomeComponent} from './components/home/home.component';
import {IndexComponent} from './components/index/index.component';
import {DocsLayoutComponent} from './components/index/docs-layout.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {IgxOverlayService} from 'igniteui-angular';
/*import {FroalaViewModule} from 'angular-froala-wysiwyg';
import {FroalaEditorModule} from 'angular-froala-wysiwyg/editor/editor.module.js';*/

import 'froala-editor/js/plugins.pkgd.min.js'

import {CanDeactivateGuard} from './guards/can-deactivate/can-deactivate.guard';
import {UserMenuComponent} from './components/user-menu/user-menu.component';
import {QuickActionsModule} from './views/quick-actions/quick-actions.module';
import {ImageBeforeUploadModule} from './modules/image-before-upload/image-before-upload.module';
import {FilterGridModule} from './views/filter-grid/filter-grid.module';
import {MatDialogComponent} from './modules/mat-dialog/mat-dialog.component';
import {BucketEditComponent} from './views/buckets/components/bucket-edit/bucket-edit.component';
import {TagEditComponent} from './views/tags/components/tag-edit/tag-edit.component'
import {PasswordComponent} from './views/admin/components/password/password.component'
import {AdminEmailEditComponent} from './views/admin/components/admin-email-edit/admin-email-edit.component'
import {PhoneEditComponent} from './views/admin/components/phone-edit/phone-edit.component'
import {FarmBulkContact} from './views/farms/components/farm-bulk-contact/farm-bulk-contact.component';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {LoadingComponent} from './shared/components/loading/loading.component';
import {LoadingService} from './shared/components/loading/loading.service';
import {EmailViewComponent} from './views/emails/components/email-view/email-view.component';
import { CreateNoteComponent } from './views/notes/components/create-note/create-note.component';
import { MatNewGridComponent } from './modules/mat-new-grid/mat-new-grid.component';
import { ActivitysTrackerComponent } from './shared/components/activitys-tracker/activitys-tracker.component';
import {MyFollowupsComponent} from './views/my-stuff/components/my-followups/my-followups.component';
import {PreviousRouteService} from './services/url.service';

import { KendoModule } from './modules/kendo.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

import { AppPdfViewerComponent } from './modules/pdf-viewer/pdf-viewer.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FormPhoneEditComponent } from './views/phone-numbers/components/phone-edit/phone-edit.component';



// import { UserMenuPermissionComponent } from './views/admin/components/user-menu-permission/user-menu-permission.component';



@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        HomeComponent,
        DocsLayoutComponent,
        IndexComponent,
        UserMenuComponent,
        MatDialogComponent,
        MatNewGridComponent,
        BucketEditComponent,
        TagEditComponent,
        PasswordComponent,
        AdminEmailEditComponent,
        PhoneEditComponent,
        FarmBulkContact,
        LoadingComponent,
        EmailViewComponent,
        CreateNoteComponent,
        ActivitysTrackerComponent,
        MyFollowupsComponent,
        AppPdfViewerComponent ,
        FormPhoneEditComponent 
        // UserMenuPermissionComponent
    ],
    entryComponents: [MatDialogComponent, MatNewGridComponent, BucketEditComponent, PasswordComponent, AdminEmailEditComponent,
        PhoneEditComponent, FarmBulkContact, EmailViewComponent, CreateNoteComponent, AppPdfViewerComponent,FormPhoneEditComponent   ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InfragisticsModule,
        QuickActionsModule,
        ImageBeforeUploadModule,
        /*CategoryChartSamplesModule.forRoot(),
        CategoryChartPerformanceSamplesModule.forRoot(),
        FinancialChartSamplesModule.forRoot(),
        GaugeSamplesModule.forRoot(),*/
        ToasterModule.forRoot(),
        AppviewsModule,
        AngularMaterialModule,
        // DataTablesModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        // TODO: remove this
        FilterGridModule,
        KendoModule,
        TreeViewModule,
        NgxExtendedPdfViewerModule,
    
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true,
        },
        AuthGuard,
        CanDeactivateGuard,
        IgxOverlayService,
        LoadingService,
        PreviousRouteService
    ]
})
export class AppModule {
    constructor(private previousRouteService : PreviousRouteService){}
    
}
