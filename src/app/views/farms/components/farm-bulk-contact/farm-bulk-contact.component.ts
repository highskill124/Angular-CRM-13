// import { ICbLookup } from './../../models/shared';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FarmService} from '../../../../services/farm/farm.service';
// import { SharedService } from '../services/shared.service';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {takeWhile} from 'rxjs/operators';

import {ToasterService} from 'angular2-toaster';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';


@Component({
    selector: 'app-farm-bulk-contact',
    templateUrl: './farm-bulk-contact.component.html',
    styleUrls: ['./farm-bulk-contact.component.css']
})
export class FarmBulkContact implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<FarmBulkContact>,
                private farmService: FarmService, private route: ActivatedRoute, private cbLookupService: CouchbaseLookupService,
                private router: Router, private dialog: MatDialog, private toasterService: ToasterService) {
    }

    // tslint:disable: member-ordering

    docID = '';
    alive = true;
    saveDisabled = false;

    InteliusForm = new FormGroup({
        // docId : new FormControl({value: ''}, Validators.requiredTrue),
        // farmid : new FormControl({value: '', disabled: false}, Validators.required),
        emailphone: new FormControl({value: '', disabled: false}, Validators.required),

    });

    // @Output() reloadGrid: EventEmitter<boolean> = new EventEmitter<boolean>();


    ngOnInit() {
        this.docID = this.data.DocId
        console.log('DocId: ' + this.docID)


    }


    saveUpdade() {
        this.saveDisabled = true;
        const validJson: Boolean = this.validateJson(this.InteliusForm.get('emailphone').value)
        if (validJson === true) {
            const parsedBody = JSON.parse(this.InteliusForm.get('emailphone').value)
            this.farmService.inteliusUpdate(this.docID, parsedBody)
                .pipe(
                    takeWhile(_ => this.alive),
                )
                .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success !', res.Message);
                        //TODO: Issue diffrent Reload if Email an/or Phone have been updated
                        this.dialogRef.close({mode: 'Update' , reload: true, data: ''});
                    } else {
                        this.toasterService.pop('error', 'Error !', res.Message);
                        this.saveDisabled = false;
                    }

                })
        } else {
            this.toasterService.pop('error', 'Error !', 'Text is not in valid JSON format');
            this.saveDisabled = false;
        }
    }


    close() {

        console.log(this.InteliusForm)
        this.dialogRef.close()

    }

    validateJson(str) {
        try {
            JSON.parse(str)
            return true
        } catch (error) {
            return false

        }
    }
}


