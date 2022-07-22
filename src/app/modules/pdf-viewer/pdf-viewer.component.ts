import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.scss']
})
export class AppPdfViewerComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    
    pageLoad(e : any){
        console.log(e)
      }

    ngOnInit(): void {

    
    }

}