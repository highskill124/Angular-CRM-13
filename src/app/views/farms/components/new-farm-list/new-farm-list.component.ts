import {Component, OnInit, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {FarmService} from '../../../../services/farm/farm.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BucketEditComponent} from '../../../buckets/components/bucket-edit/bucket-edit.component';
import {MatDialog} from '@angular/material/dialog';
import {DropdownGuids} from '../../../../models/dropdown-guids.enum';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {GridFiltersService} from '../../../../services/grid-filters.service';

@Component({
    selector: 'app-new-farm-list',
    templateUrl: './new-farm-list.component.html',
    styleUrls: ['./new-farm-list.component.css']
})
export class NewFarmListsComponent implements OnInit {
    gridtitle: String = '';
    hideSelectOption = false;
    hideHiddenDisplay = false;
    showloading = false;
    hardReload = false;
    DocId: string;


    @ViewChild('filterGrid') filterGrid: FilterGridComponent;

    public config = {
        grid: GridColumnsListGuids.FARM_GRID,
        column: GridColumnsListGuids.FARM_GRID,
        filter: GridColumnsListGuids.FARM_GRID,

        // remove the search options
        quickSearchTypeOption: DropdownGuids.QSTYPE_OPTIONS_FARM_LIST,

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
            {icon: 'remove_red_eye', isActive: true, class: 'custom-size', callback: (data, params) => this.handleView(data, params)},
            {icon: 'edit', callback: (data, params) => this.handleEdit(data, params)}
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
            {selected: ['any'], action: 'modal', label: 'Add Modal', click: (data, params) => this.handleAdd(data, params)},
            {selected: ['any'], action: 'modal', label: 'Edit Modal', click: (data, params) => this.handleEdit(data, params)},
        ],

    };
    id: any;
    ngOnInit(): void {
        // this.farmsService.controlChecks.subscribe(message => {
        //     this.DocId = message.split('::')[1];
        // });

    }
    get dataFetcherMethod() {
        return (param) => this.farmsService.farmsListGrid(param);
    }

    get dataExportMethod() {
        return (param) => this.farmsService.fetchExportData(param);
    }

    constructor(private farmsService: FarmService,
                private router: Router,
                private route : ActivatedRoute,
                private dialog: MatDialog,
                private gridFilterService: GridFiltersService,


    ) {

    }


    handleView(data, params: any) {
        this.id = data?.DocId
        //this.farmsService.changeControlChecks(data.DocId);

        console.log(params)
        console.log(this.filterGrid.activeFilters)

        const gridFilters = this.gridFilterService.getPreviousFilter(GridColumnsListGuids.FARM_GRID)


        // if (gridFilters && gridFilters.length > 0) {
        //     const activeFilters = [];
        //     if (gridFilters.length && gridFilters.find(x => x.gridGuid === GridColumnsListGuids.FARM_GRID)) {


        //         gridFilters.find(x => x.gridGuid === GridColumnsListGuids.FARM_GRID).rowIndex = params.rowIndex;
        //         this.gridFilterService.setFilter(gridFilters)
        //     }
        // }

        console.log(gridFilters)

        const state = {
            activeFilters: gridFilters.activeFilters,
            offset: this.filterGrid.offSet,
            rowCount: this.filterGrid.rowCount,
            rowIndex: params.rowIndex,
            docId : data.DocId

        }
        console.log(state)
        this.router.navigateByUrl(`/Farm/FarmMaster/${data.DocId}`, {
                state,
        });

    }

    handleAdd(data, params) {
        console.log(data, params)
    }

    handleEdit(data, params) {
        // TODO: add edit action
        debugger
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

    showMlsInfo(row) {
        console.log(row)
    }

}
