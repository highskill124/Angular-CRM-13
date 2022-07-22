import { Observable } from "rxjs";
import { IServerDropdownOption } from "./server-dropdown";

export interface GridLayout {
    colId: string;
    headerName: string;
    field : string;
    displayType?: string;
    width : number;
    sortable : boolean;
    hide : boolean;
    position : number;
} 

export class GridColumnDef {
    // types:  '' | reorder | input | select (reuired selectOptions for dropdown) | checkbox | html
   dbNode:string;
   header:string;
   type?:string = '';  // '' | input | select | checkbox | html | array | arrayShowWithkey
   tempRef?:any;
   cellClass?:string;
   selectOptions?: Observable<any[]> | string | string[] | IServerDropdownOption[] = [];  // Observable | id string to make api call | array of options 
   formatedOptions ?: IServerDropdownOption[];  // private
   isIndexCol?:boolean;
   textAlignment?:string;  // 'right' || 'center' || 'left'
   headerAlignment?:string;  // 'right' || 'center' || 'left'
   width?:string;  // 10px || 10%
   key?:string;  //need if column have array of object example [{firstname:'John'}], leave blank if array of string or number
}

export interface Actions {
    icon:string;
    color:string;  //'red' | 'green' | 'yellow'
    class?:string;
    callback(data?:any, param?:any);
}

export interface PlusActions {
    icon:string;
    color:string;  //'red' | 'green' | 'yellow'
    type:string; // 'none' | 'one' | 'many'
    class?:string;
    callback(data?:any, param?:any);
}

export class PageData {
    enabled:boolean = true;
    length?: number = 0;
    pageIndex?: number = 0;
    pageSize?: number = 25;
    previousPageIndex?:number = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];
}