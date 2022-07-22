// import { ICbLookup } from './../../models/shared';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BucketService} from '../../../../services/bucket.service';
// import { SharedService } from '../services/shared.service';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {takeWhile} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';


@Component({
    selector: 'app-bucket-edit',
    templateUrl: './bucket-edit.component.html',
    styleUrls: ['./bucket-edit.component.scss']
})
export class BucketEditComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<BucketEditComponent>,
                private bucketService: BucketService,
                private route: ActivatedRoute,
                private cbLookupService: CouchbaseLookupService,
                private router: Router,
                private dialog: MatDialog,
                private toasterService: ToasterService) {
    }

    // tslint:disable: member-ordering
    bucketGroupLists: IServerDropdownOption[] = [];
    submitText = 'Create';
    docID = '';
    alive = true;

    bucketForm = new FormGroup({
        // docId : new FormControl({value: ''}, Validators.requiredTrue),
        text: new FormControl({value: '', disabled: false}, Validators.required),
        description: new FormControl({value: '', disabled: false}, Validators.required),
        doc_group: new FormControl({value: '', disabled: false}),
        reminder_interval: new FormControl({value: '', disabled: false}),
        sort_order: new FormControl({value: '', disabled: false}),

    });

    @Output() reloadGrid: EventEmitter<boolean> = new EventEmitter<boolean>();


    ngOnInit() {
        this.getBucketGroupList('f07846d1-4d78-4879-8540-77cdb139bbc5')

        if (this.data.mode === 'edit') {
            this.submitText = 'Update'

            this.docID = this.data.DocId

            this.loadGridData()

        }
    }

    loadGridData() {
        this.bucketService.fetch(this.docID).subscribe((response: any) => {
            this.bucketForm.controls['text'].setValue(response.name)
            this.bucketForm.controls['description'].setValue(response.description)
            this.bucketForm.controls['reminder_interval'].setValue(response.days)
            this.bucketForm.controls['sort_order'].setValue(response.sort_order)
            this.bucketForm.controls['doc_group'].setValue(response.doc_group)
            console.log(response)
        })

    }

    getBucketGroupList(guid: string) {
        this.cbLookupService.getOptions(guid).subscribe((response: any) => {
            // tslint:disable-next-line:no-string-literal
            console.log('Bucket Group')
            console.log(response);
            this.bucketGroupLists = response
        })

    }

    saveUpdade() {
        if (this.submitText === 'Update') {
            this.bucketService.update({id: this.docID, formData: this.bucketForm.value}).pipe(
                takeWhile(_ => this.alive),
            )
                .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.bucketForm.markAsPristine()
                        this.reloadGrid.emit(true)
                    }

                })
        } else if (this.submitText === 'Create') {
            this.bucketService.create(this.bucketForm.value).pipe(
                takeWhile(_ => this.alive),
            )
                .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.docID = res.docID
                        this.submitText = 'Update'
                        this.bucketForm.markAsPristine()
                        this.reloadGrid.emit(true)
                    }

                })


        }


    }

    close() {
        if (!this.bucketForm.pristine) {
            const dialogRef2 = this.dialog.open(MatDialogComponent,
                {
                    disableClose: true,
                    data: {message: 'Do you want to save changes saving before exit ?', title: 'Unsaved Changes'},
                    panelClass:'no-pad-dialog',
                    autoFocus: false
                });

            dialogRef2.afterClosed().subscribe(result => {
                if (result === true) {
                    console.log('Will do an ' + this.submitText + ' ' + this.docID);
                    this.saveUpdade();

                    this.dialogRef.close();

                } else {
                    dialogRef2.close();
                    this.dialogRef.close()
                }
            });

        } else {
            console.log(this.bucketForm)
            this.dialogRef.close()

        }
    }

    logConsole() {
        console.log(this.bucketForm)
    }
}


