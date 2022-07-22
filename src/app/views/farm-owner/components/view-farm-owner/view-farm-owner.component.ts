import {Component, Input, OnInit} from '@angular/core';
import {IFarmOwners} from '../../../../models/farm';

@Component({
    selector: 'app-view-farm-owner',
    templateUrl: './view-farm-owner.component.html',
    styleUrls: ['./view-farm-owner.component.scss'],
})
export class ViewFarmOwnerComponent implements OnInit {

    @Input() farmOwners: IFarmOwners;

    ngOnInit() {
    }
}
