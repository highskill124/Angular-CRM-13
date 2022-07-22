import {Component} from '@angular/core';
import {IGridType} from '../../../models/grid-types.enum';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {

  /*@ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  @Input() gridInput: IGridInput;

  allHeaders: GridColumn[];

  tableHeaders: Array<any> = [];
  searchFields: Array<IGridSearchField> = [];

  url = '';

  paramsForm: FormGroup;
  formsAccordionOpened = false;

  gridData: any = [];

  dtOptions: Promise<any>;

  constructor(
    private dataService: GridTableDataService,
    private columnsService: GridColumnsService,
    private fb: FormBuilder) {
    //
  }

  ngOnInit() {
    this.setDtOptions();
  }

  get actions(): Array<IGridAction> {
    return this.gridInput.actions;
  }

  setDtOptions() {
    this.dtOptions = new Observable(observer => {
      this.columnsService.fetchColumns(this.gridInput.gridType.guid).subscribe((columns: GridColumn[]) => {
        this.allHeaders = columns;
        // update search fields
        columns.forEach(column => {
          if (column.filter) {
            this.searchFields.push({
              name: column.column_heading,
              value: column.column_heading,
            });
          }
        });
        this.createParamsForm();
        const gridColumns = [];
        // add actions column here
        if (this.actions && this.actions.length > 0) {
          const buttons = [];
          this.actions.forEach(action => {
            buttons.push(`<button class="btn btn-default btn-xs" (click)="onActionClicked($event, ${action})">${action}</button>`);
          });

          gridColumns.push({
            data: null,
            defaultContent: buttons.join(' '),
          });
        }
        columns.forEach((column) => {
          if (column.column_name !== 'uid') {
            gridColumns.push({
              data: column.column_name,
              title: column.column_heading,
              visible: column.display,
            });
          }
        });
        this.tableHeaders = gridColumns;

        const that = this;
        const dtOptions = {
          // destroy: true,
          pagingType: 'full_numbers',
          pageLength: this.paramsForm.get('rowcount').value,
          serverSide: true,
          searching: false,
          processing: true,
          // Declare the use of the extension in the dom parameter
          dom: 'Bfrtip',
          // Configure the buttons
          buttons: [
            {
              extend: 'copy',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'print',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'csv',
              exportOptions: {
                columns: ':visible',
              }
            },
            {
              extend: 'excel',
              exportOptions: {
                columns: ':visible'
              }
            },
          ],
          ajax: (dataTablesParameters: any, callback) => {
            that.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              that.updateParamsFormValues(dtInstance);
              console.log(that.paramsForm.value);
              that.dataService.fetchData(that.constructGridDataUrl(that.paramsForm.value))
                .map((resp) => {
                  console.log('data unfiltered ', resp);
                  resp[0] = that.formatSalesDate(resp[0]);
                  resp[0] = that.sortData(resp[0]);
                  // resp[0] = that.filterDisplayedColumns(resp[0]);
                  return resp;
                })
                .subscribe(resp => {
                    // console.log(gridColumns$);
                    that.gridData = resp[0];
                    // console.log(that.gridData);
                    callback({
                      recordsTotal: resp[1][0].Row_Count,
                      recordsFiltered: resp[1][0].Row_Count,
                      data: resp[0],
                    });
                  },
                  (error) => {
                    console.log(error);
                  });
            });
          },
          columns: gridColumns,
        };

        observer.next(dtOptions);
        observer.complete();
      });
    }).toPromise();
  }

  onActionClicked($event, actionType) {
    console.log($event, actionType);
  }

  private createParamsForm() {
    this.paramsForm = this.fb.group({
      rowcount: ['10'],
      sortBy: [''],
      sortOrder: [''],
      page: ['1'],
    });

    if (this.searchFields.length > 0) {
      this.searchFields.forEach((field) => {
        const control = this.fb.control(
          field.value,
        );
        this.paramsForm.addControl(field.name, control);
      });
    }
  }

  private addSearchControls() {
    if (this.searchFields.length > 0) {
      this.searchFields.forEach((field) => {
        const control = this.fb.control(
          field.value,
        );
        this.paramsForm.addControl(field.name, control);
      });
    }
  }

  private updateParamsFormValues(dtInstance: DataTables.Api) {
    const order = dtInstance.order();
    if (order && this.tableHeaders.length > 0) {
      this.paramsForm.get('sortBy').setValue(this.tableHeaders[order[0][0]]['data']);
      this.paramsForm.get('sortOrder').setValue(order[0][1]);
    }
    const page = dtInstance.page();
    this.paramsForm.get('page').setValue(page);
  }

  private formatSalesDate(data: any) {
    return data.map((item) => {
      item.sale_date = dateReadable(item.sale_date);
      return item;
    });
  }
  private sortData(data: any) {
    const sortKey = this.paramsForm.get('sortBy').value;
    const sortOrder = this.paramsForm.get('sortOrder').value;
    return data.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) {
        return sortOrder === 'desc' ? 1 : -1;
      }
      if (a[sortKey] > b[sortKey]) {
        return sortOrder === 'desc' ? -1 : 1;
      }
      return 0;
    });
  }

  updateTable() {
    this.toggleFormsAccordion(false);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.paramsForm.get('rowcount').value).draw();
    });
  }

  toggleColumn(toggleResult: IColumnsToggleResult) {

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      this.tableHeaders.forEach((header, index) => {

        if (toggleResult.columnHeading === header.title) {
          // update on the server
          this.dataService.toggleColumnVisibility(toggleResult.columnGuid, toggleResult.columnVisibility)
            .subscribe((res: any) => {
              // update the table
              dtInstance.column(index).visible(toggleResult.columnVisibility, false);
              // dtInstance.columns.adjust().draw( false );
            },
              (error) => {
                console.log('Failed to update column visibility ', error);
              });
        }
      });
    });

  }

  toggleFormsAccordion($event) {
    this.formsAccordionOpened = $event;
  }

  accordionHeading() {
    if (this.formsAccordionOpened) {
      return 'Grid options';
    } else {
      let title = `ROWCOUNT:${this.paramsForm.get('rowcount').value}`;
      if (this.searchFields.length > 0) {
        this.searchFields.forEach(field => {
          if (this.paramsForm.get(field.name).value) {
            title += ` | ${field.name.toUpperCase()}:${this.paramsForm.get(field.name).value}`;
          }
        });
      }

      return title;
    }
  }

  constructGridDataUrl(parameters: any = {}) {
    console.log('sent params ', parameters);
    let paramsUrl = `${this.gridInput.gridType.url}?rowcount=${parameters.rowcount}&offset=${parameters.page}`;
    if (this.searchFields.length > 0) {
      this.searchFields.forEach(field => {
        if (parameters[field.name]) {
          paramsUrl += `&${field.name}=${parameters[field.name]}`;
        }
      });
    }

    console.log('params url is ', paramsUrl);
    return paramsUrl;
  }*/
}
