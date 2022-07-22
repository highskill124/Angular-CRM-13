import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { forkJoin, Observable, of } from 'rxjs';
import { Actions, GridColumnDef, GridLayout, PageData, PlusActions, IServerDropdownOption } from '../models';
import { DemoDataService } from '../services/demo.service'

@Component({
  selector: 'app-mat-table-dynamic',
  templateUrl: './mat-table-dynamic.component.html',
  styleUrls: ['./mat-table-dynamic.component.scss']
})
export class MatTableDynamicComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('table') table: MatTable<GridLayout>;
  paging: boolean;
  showMultiSelectOptions:boolean;
  
  // inputs
  @Input() set reload(val) { if(val) this.loadData(); };
  @Input() tableHeader: string = '';
  @Input() gridId: any = '';
  @Input() dataId: any = '';
  @Input() reOrderCol:string ='';
  @Input() tableWidth:string = '';  // '500px | 80% etc'
  @Input() tableHeight:string = '';  // '500px | 80% etc'
  columns: GridColumnDef[]=[];
  dataSource: Array<any>=[];
  @Input() Reorder:boolean = true;
  @Input() actions: Actions[] = [];
  @Input() plusActions: PlusActions[] = [];
  @Input() pageData: PageData = new PageData();
  @Input() multiSelect: boolean = false;

  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  toShowActions:boolean = false;

  // toDispColumns
  displayedColumns:string[]=[];

  columnLayout$: Observable<Array<GridColumnDef>>
  tableData$ : Observable<Array<any>>

  loagingGridData:boolean = true;

  constructor(
    private demoDataService: DemoDataService,
  ) {
    
  }

  ngOnInit() {
    this.toShowActions = this.actions.length > 0; 
    this.columnLayout$ = typeof this.gridId == 'object' ? of([{Data:this.gridId}]) : this.demoDataService.getMatGridLayout(this.gridId)
    this.tableData$ = typeof this.dataId == 'object' ? of([{Data:this.dataId}]) : this.demoDataService.getMatGridData(this.dataId)
    this.loadData();
  }

  checkIsArray(arg) {
    return Array.isArray(arg);
  }

  loadData() {
    this.pageData.pageIndex = 0;
    this.displayedColumns = [];
    this.loagingGridData = true;
    forkJoin({ 
      columns: this.columnLayout$,
      data: (this.pageData && this.pageData.enabled) 
              ? this.demoDataService.getAll({rowCount: this.pageData.pageSize, offset: this.pageData.pageIndex * this.pageData.pageSize}) 
              : this.tableData$,
    }).subscribe(
      (res:any) => {
        if(res) {
          if(res.columns) {
            this.columns = res.columns[0].Data;
            this.checkColumnDefinations();
          }
          if(res.data) {
            let resd = (res.data.Data) ? res.data : res.data[0];
            this.dataSource = resd.Data;
            if(this.pageData.enabled) {
              this.pageData.length = resd.RowCount;
              if(!this.pageData.pageSizeOptions.includes(this.pageData.length)) {
                this.pageData.pageSizeOptions.push(this.pageData.length);
              }
            }
          }
        }
      }
    )
  }

  loadPageData() {
    this.paging = true;
    forkJoin({
      data: (this.pageData && this.pageData.enabled) 
              ? this.demoDataService.getAll({rowCount: this.pageData.pageSize, offset: this.pageData.pageIndex * this.pageData.pageSize}) 
              : this.tableData$,
    }).subscribe(
      (res:any) => {
        if(res) {
          if(res.data) {
            let resd = (res.data.Data) ? res.data : res.data[0];
            this.dataSource = resd.Data;
            if(this.pageData.enabled) {
              this.pageData.length = resd.RowCount;
            }
            if(!this.pageData.pageSizeOptions.includes(this.pageData.length)) {
              this.pageData.pageSizeOptions.push(this.pageData.length);
            }
          }
        }
        this.paging = false;
      }
    )
  }

  selectAll(event) {
    this.dataSource.map(item => { item.matSelect = event.checked});
    this.showMultiSelectOptions = event.checked;
  }

  checkIfSelected() {
    let itm = this.dataSource.filter(item => item.matSelect);
    this.showMultiSelectOptions = (itm && itm.length > 0)
  }

  checkColumnDefinations() {
    let allObs:any = {};
    let sl = this.columns.filter(l => l.dbNode == 'matSelect')
    let ac = this.columns.filter(cl => cl.dbNode == 'matActions');
    if(this.multiSelect && (!sl || !sl.length)) {
      this.columns.unshift({ header: ' ', dbNode:'matSelect', type:'matSelect', width:'50px'})
    }
    if(this.toShowActions && (!ac || !ac.length)) {
      this.columns.push( { header: 'Actions', dbNode:'matActions', type:'matActions', textAlignment:'center', headerAlignment:'center'})
    }
    this.columns.map(
      (item, i) => {
        this.displayedColumns.push(item.dbNode);
        if(item.type == 'select') {
          if(item.selectOptions) {
            if(item.selectOptions instanceof Observable) {
              allObs[`sel@${i}`] = item.selectOptions; 
            } else if(typeof item.selectOptions == 'string') {
              allObs[`sel@${i}`] = this.demoDataService.getOptions(item.selectOptions);
            } else if (typeof item.selectOptions == 'object' && item.selectOptions.length > 0) {
              if(typeof item.selectOptions[0] == 'string') {
                let data:IServerDropdownOption[] = [];
                item.selectOptions.forEach(slItm => data.push({ name: slItm, value: slItm}));
                allObs[`sel@${i}`] = of(data);
              } else if(typeof item.selectOptions[0] == 'object' && item.selectOptions[0].name) {
                allObs[`sel@${i}`] = of(item.selectOptions);
              } else {
                item.selectOptions = [];
                allObs[`sel@${i}`] = of(item.selectOptions); 
              }
            } else {
              item.selectOptions = [];
              allObs[`sel@${i}`] = of(item.selectOptions); 
            }
          } else {
            item.selectOptions = [];
            allObs[`sel@${i}`] = of(item.selectOptions); 
          }
        }
        return item;
      }
    )
    if(!this.isEmpty(allObs)) {
      forkJoin(allObs).subscribe(
        (res:any) => {
          if(res) {
            for(var key in res) {
              let indx = key.split('@')[1];
              this.columns[indx].formatedOptions = res[key];
            }
            this.loagingGridData = false;
          }
        }, error => {
          for(var key in allObs) {
            let indx = key.split('@')[1];
            this.columns[indx].formatedOptions = [];
          }
          this.loagingGridData = false;
        }
      )
    } else {
      this.loagingGridData = false;
    }
  }

  getArrayOptions(row:any,column: GridColumnDef) {
    if(column.key) {
      return row[column.dbNode].filter(item => item.hasOwnProperty(column.key));
    }
  }

  getArrayValueWithKeyOptions(row, column: GridColumnDef) {
    let options = [];
    row[column.dbNode].forEach((item)=> {
        if(Object.keys(item)[0]) {
          options.push(`${this.getIconHtml(Object.keys(item)[0], column.dbNode)} ${item[Object.keys(item)[0]]}`);
          // options.push(`${Object.keys(item)[0]} : ${item[Object.keys(item)[0]]}`);
        }
    });
    return options;
  }

  getIconHtml(key:string, colum:string) {
    if(['emails','email','mobiles','mobile','phones','phone','contact'].includes(colum.toLowerCase())) {
      switch(key) {
        case 'work' :
          return `<span class="mr material-icons ${key}">work</span>`;
        case 'mobile' :
            return `<span class="mr material-icons ${key}">phonelink_ring</span>`;
        case 'phone' :
            return `<span class="mr material-icons ${key}">phone</span>`;
        case 'home' :
            return `<span class="mr material-icons ${key}">home</span>`;
        default : 
          return `<span class="mr material-icons ${key}">person</span>`;
      }
    } else {
      return `${key}: `;
    }
  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  dropTable(event: CdkDragDrop<GridLayout[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    if(this.reOrderCol) {
      let i = 0;
      this.dataSource.forEach((element) => {element[this.reOrderCol] = i; i++ })
    }
    this.table.renderRows();
  }

  printDebug() {
    console.log(this.table.dataSource);
  }

  outSouceData() {
    this.getData.emit(this.dataSource);
  }

  outSouceSelectedData() {
    this.getData.emit(this.dataSource.filter(item => item.matSelect));
  }

  performaction(row: any, col:Actions) {
    col.callback(row);
  }

  performPlusAction(actn:PlusActions) {
    if(actn.type == 'none') {
      actn.callback();
    } else if (actn.type == 'one') {
      actn.callback(this.dataSource.filter(item => item.matSelect)[0]);
    } else if(actn.type == 'many') {
      actn.callback(this.dataSource.filter(item => item.matSelect));
    }
  }

  get getPlusActions() {
    return this.plusActions.filter(
      item => {
        if(item.type == 'none') {
          return true;
        } else {
          let selectedItems = this.dataSource.filter(item => item.matSelect);
          if( item.type == 'one') {
            return (selectedItems.length == 1) ? true : false;
          } else if (item.type == 'many') {
            return (selectedItems.length >= 1) ? true : false;
          }
        }
        return false;
      }
    );
  }

  pageChanged(event) {
    if(event.previousPageIndex > event.pageIndex) {
      this.pageData.pageIndex--;
    } else if(event.previousPageIndex < event.pageIndex){
      this.pageData.pageIndex++;
    } else {
      this.pageData.pageIndex = 0;
    }
    if(event.pageSize) {
      this.pageData.pageSize = event.pageSize;
    }
    this.loadPageData();
  }

  openMenu(menu) {
    menu.openMenu();
    setTimeout(() => {
      document.getElementsByClassName('closemenu')[0].addEventListener('mouseover',() => menu.closeMenu())
    }, 100)
  }
}