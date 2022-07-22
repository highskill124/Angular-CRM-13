import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-mat-dialog',
    templateUrl: './mat-dialog.component.html',
    styleUrls: ['./mat-dialog.component.scss']
})
export class MatDialogComponent implements OnInit {
    iconColor:any = '#000';
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
    }

    getIcon(type) {
        switch (type) {
            case 'warning' : 
                this.iconColor = this.data.iconColor || '#ffc107';
                return 'exclamation-circle';
            case 'info' :
                this.iconColor = this.data.iconColor || '#17a2b8';   
                return 'info-circle';
            default :
                this.iconColor = this.data.iconColor || '#dc3545';
                return 'question-circle';
        }
    }

}
