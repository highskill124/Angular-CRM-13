import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { BucketGridComponent } from "./components/bucket-grid/bucket-grid.component";
import { TagGridComponent } from "../../views/tags/components/tag-grid/tag-grid.component";

const routes: Routes = [
    {
        path: "Buckets",
        component: BucketGridComponent,
        data: { displayName: "Bucket List" },
    },
    {
        path: "Tags",
        component: TagGridComponent,
        data: { displayName: "Tag List" },
    },
    {
        path: "Admin",
        loadChildren: () =>
            import("src/app/views/admin/admin.module").then(
                (m) => m.AdminModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BucketRoutingModule {}
