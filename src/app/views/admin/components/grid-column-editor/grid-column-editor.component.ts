import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../../../services/admin.service';
import {GridService } from '../../../../services/grid.service'
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {LookupGuids } from '../../../../models/lookup';
import {combineLatest, startWith, takeWhile} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
    selector: 'app-grid-column-editor',
    templateUrl: './grid-column-editor.component.html',
    styleUrls: ['./grid-column-editor.component.scss']
})
export class GridColunEditorComponent implements OnInit  {

    mode = 'new'
    saveBttn = 'Create Column'
    columnData
    columnForm : FormGroup;
    types : IServerDropdownOption[] = [];
    dialogTitle = "This is a test"
    submitted = false


    @Output() reloadGrid: EventEmitter<boolean> = new EventEmitter<boolean>();



    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<GridColunEditorComponent>,
                private adminService: AdminService,
                private gridService : GridService ,
                private cbLookupService: CouchbaseLookupService,
                private toasterService: ToasterService,
                private fb: FormBuilder) {
                    this.columnForm = fb.group({
                        ParentId:[, Validators.required],
                        colId: [],
                        field: [, Validators.required],
                        headerName: [, Validators.required],
                        hide: [],
                        sortable: [],
                        sortkey:['', RxwebValidators.required({conditionalExpression: (x) => x.sortable === true})],
                        position: [],
                        width:[],
                        type:[]

                    })
                }

    
                ngOnInit() {
                    this.getTypes(LookupGuids.ColumnRenderType)
                    this.getGridName()
                  
                    if(this.data.mode === 'edit'){
                        this.mode = 'edit'
                        this.loadData()
                        this.saveBttn = 'Update Column'
            
                    } else {
            
                        this.mode = 'new'
                        this.columnForm.patchValue({
                            ParentId: this.data.ParentId})
                   
                    }
                    
            
                }
    
                getTypes(guid: string){

                    this.cbLookupService.getOptions(LookupGuids.ColumnRenderType).subscribe((res: any) => {
                        console.log(res);
                        this.types = res;
                    })

                }

                loadData() {
                    this.gridService.fetchColumn(this.data.ParentId, this.data.DocId).subscribe(res => {
                            this.columnData = res.Data,
                            this.setinitalValue(),
                            console.log(res)
                      
                    })
                }

                getGridName() {
                    this.gridService.fetchGridName(this.data.ParentId).subscribe(res => {
                            this.dialogTitle  = 'Grid Column Editor - ' + res.Data.name,
                            console.log(res)
                      
                    })
                }


                setinitalValue() {
                    console.log(this.columnData)

                    this.columnForm.patchValue({
                        ParentId: this.data.ParentId,
                        colId: this.columnData.colId,
                        field: this.columnData.field,
                        headerName: this.columnData.headerName,
                        hide: this.columnData.hide ? this.columnData.hide : false,
                        sortable: this.columnData.sortable ? this.columnData.sortable : false,
                        sortkey : this.columnData.sortkey,
                        position : this.columnData.position,
                        width: this.columnData.width,
                        type: this.columnData.type,
                        // email: this.getdfltEmail(data)
                   
            
            
                    })
                }

                close() {
        
                    if(this.submitted === true){
                        this.reloadGrid.emit() 
                    }
                    
                    this.dialogRef.close({ mode: this.saveBttn, reload: this.submitted })
                }

                save() {
                    console.log('Save hit ' + this.saveBttn)
                    if(this.saveBttn === 'Create Column'){
                        this.gridService.createColumn(this.columnForm.value.ParentId,this.columnForm.value).subscribe((res: any) => {
                            if(res.Success === true){
                                this.toasterService.pop('success', 'Success!', res.Message);
                                this.saveBttn = 'Update Column'
                                this.columnForm.markAsPristine()
                                this.columnForm.patchValue({colId: res.Data.colId})
                                this.submitted = true
                            } else {
                                this.toasterService.pop('error', res.Error);
                            }
            
            
                        })
            
            
                    } else {
                        console.log('Hit the Update Button')
                        console.log(this.columnForm.value)
                        this.gridService.updateColumn(this.columnForm.value.ParentId, this.columnForm.value.colId, this.columnForm.value).subscribe((res: any) => {
                            if(res.Success === true){
                                this.toasterService.pop('success', 'Success!', res.Message);
                                this.columnForm.markAsPristine()
                                this.submitted = true
                            } else {
                                this.toasterService.pop('error', res.Error);
                            }
                            
                        })
                    }
                
                }
}

