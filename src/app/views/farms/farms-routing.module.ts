import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { UploadComponent } from "./components/file-upload/upload.component";
import { FarmListsTestComponent } from "./components/farm-lists-test/farm-lists-test.component";
import { FarmsListAgGridComponent } from "./components/farms-list-ag-grid/farms-list-ag-grid.component";
import { FarmMasterWrapperComponent } from "./components/farm-master/wrapper/farm-master-wrapper.component";
import { FarmMasterResolver } from "../../resolvers/farm-master-resolver.service";
import { NewFarmListsComponent } from "./components/new-farm-list/new-farm-list.component";

const routes: Routes = [
    {
        path: "FarmLink2",
        component: FarmsListAgGridComponent,
        data: { displayName: "Farm List" },
    },
    {
        path: "FarmMaster/:DocId",
        component: FarmMasterWrapperComponent,
        // resolve: {'farmMaster': FarmMasterResolver},
        data: { displayName: "Farm Master" },
    },
    {
        path: "FarmUpload",
        component: UploadComponent,
        data: { displayName: "Farm Upload" },
    },
    {
        path: "FarmList",
        data: { displayName: "Farm List" },
        component: NewFarmListsComponent,
    },
    {
        path: "Test",
        data: { displayName: "Farm List Test" },
        component: FarmListsTestComponent,
    },
    {
        path: "Setup",
        loadChildren: () =>
            import("src/app/views/buckets/bucket.module").then(
                (m) => m.BucketModule
            ),
    },

    {
        path: "CampaignLink1",
        loadChildren: () =>
            import("src/app/views/campaign/farm-campaign.module").then(
                (m) => m.FarmCampaignModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FarmsRoutingModule {}
