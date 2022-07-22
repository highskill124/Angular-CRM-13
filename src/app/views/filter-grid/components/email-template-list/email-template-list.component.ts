import {Component} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {Router} from '@angular/router';
import {BucketEditComponent} from '../../../buckets/components/bucket-edit/bucket-edit.component';
import {MailTemplateService} from '../../../../services/mail-template.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-email-template-list',
    templateUrl: './email-template-list.component.html',
    styleUrls: ['./email-template-list.component.scss']
})
export class EmailTemplateListComponent {

    public config = {
        grid: GridColumnsListGuids.EMAIL_TEMPLATE_GRID,
        column: GridColumnsListGuids.EMAIL_TEMPLATE_GRID,
        filter: GridColumnsListGuids.FARM_GRID,

        // remove the search options
        quickSearchTypeOption: null, // DropdownGuids.QSTYPE_OPTIONS_FARM_LIST,

        // configure export
        exportFormats:

        // example to get csv and excel
        // [...dataExportFormats],

        // example to get csv
            [{name: 'Export to CSV', value: 'csv', selected: false}],

        // examples to remove
        // [],
        // null,

        // configure actions
        actions: [
            {icon: 'edit', callback: (data, params) => this.handleEdit(data, params)},
            {icon: 'delete', color: 'red', isActive: false, callback: (data, params) => this.handleDelete(data, params)},
        ],

        // configure plus actions
        plusActions: [
            // none, one, many, any
            // { selected: ['one', 'many'], action: 'add-interaction-action' },
            // { selected: ['one', 'many'], action: 'action-add-note' },
            // { selected: ['one', 'many'], action: 'action-add-task' },
            // { selected: ['one', 'many'], action: 'action-add-followup' },
            // { selected: ['one', 'many'], action: 'action-add-phone-number' },
            // { selected: ['one', 'many'], action: 'action-action-add-email' },
            // { selected: ['one', 'many'], action: 'bucket-action' },
            //  { selected: ['any'], action: 'list-action' },
            {selected: ['any'], action: 'modal', label: 'Open Custom Modal', click: (data, params) => this.handleEdit(data, params)},
        ],

    };

    get dataFetcherMethod() {
        return (param) => this.farmsTemplateService.getAllTemplates(param);
    }

    get dataExportMethod() {
        return (param) => this.farmsTemplateService.getAllTemplates(param);
    }

    constructor(private farmsTemplateService: MailTemplateService, private router: Router, private dialog: MatDialog) {

    }

    handleView(data, params) {
        this.router.navigateByUrl(`/Farm/FarmMaster/${data.DocId}`, {
            state: {
                activeFilters: params.colDef.filters,
                offset: params.colDef.filterGrid.agGridBase.previousRequestParams.request.startRow,
            },
        });
    }

    handleEdit(data, params) {
        // TODO: add edit action

        if (!data.selectedRowIds || !data.selectedRowIds.length) {
            window.alert('no data selected');
            return;
        }

        const tmpID = data.selectedRows[0].DocId;
        const dialogRef = this.dialog.open(BucketEditComponent, {
            data: {DocId: tmpID, mode: 'edit'},
            disableClose: false, width: '600px', position: {top: '50px'},
        });
    }

    handleDelete(data, params) {
        // TODO: add delete action
    }

    handleTrackChanges(data, params) {
        // TODO: add track changes logic
    }


    reloadData() {
        // this.filtergrid.reload()
    }


}
