import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {GridColumnsListGuids} from '../../../../models/grid-columns-list-guids';
import {AdminService} from '../../../../services/admin.service';
import {Router} from '@angular/router';
// import { BucketEditComponent } from '../bucket-edit/bucket-edit.component';
import {FilterGridComponent} from '../../../filter-grid/components/filter-grid/filter-grid.component';
import {ToasterService} from 'angular2-toaster';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MenuService } from '../../../../services/menu.service';
import { IMenu, IMenuParents} from '../../../../models/menu'
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, shareReplay, takeWhile, tap } from 'rxjs/operators';
import { MatDialogComponent } from '../../../../modules/mat-dialog/mat-dialog.component';
import { EMPTY, empty, of } from 'rxjs';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';

@Component({
    selector: 'app-menu-edit',
    templateUrl: './menu-edit.component.html',
    styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent implements OnInit, OnDestroy {

    menuData$: Observable<IMenu>;
    menuParents$: Observable<Array<IMenuParents>>
    form: FormGroup;
    saveBttn = 'Create'
    alive = true;
    showMessages: any = {};
    errors: string[] = [];
    menuData: IMenu;

    @Output() reloadGrid: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<MenuEditComponent>,
        public dialog: MatDialog,
        private adminService: AdminService,
        private menuService: MenuService,
        private fb: FormBuilder,
        private toasterService: ToasterService,
    )  { }


    ngOnInit() {
        console.log('Init Form')
        this.createForm();
        if( this.data.mode === 'new') {
            console.log('Will be a new Form')
            this.emptyForm()


        } else {
            console.log('Will be loading old data')
            if (this.data && this.data.DocId && this.data.DocId !== '') {
            this.loadData(this.data.DocId)
        }
    }

    }

    ngOnDestroy() {
        this.alive = false;
    }

    emptyForm() {
        console.log('Creating an empty Form');
        // this.menuData$ = new EmptyObservable<IMenu>()
        this.menuParents$ = this.menuService.fetchMenuParents().pipe(
            tap(parents => console.log(parents))
        )
        this.saveBttn = 'Create'

    }

    selectionChange(e) {
        console.log(e)
        this.form.markAsDirty()
    }


    loadData(docId: string) {
        console.log('We are loading Data for Doc : ' + docId);
        this.menuParents$ = this.menuService.fetchMenuParents().pipe(
            tap(parents => console.log(parents))
        )

        this.menuService.fetchMenuItem(docId).subscribe((menuData: IMenu) => {
            this.menuData = menuData,
            console.log(this.menuData),
            this.patchFormData(menuData)

        })
        this.saveBttn = 'Update'

    }

patchFormData(data) {

            console.log(data.history)

            this.form.patchValue(data),
            this.form.controls['created_on'].patchValue(data.history.created_on)
            this.form.controls['created_by'].patchValue(data.history.created_by)
            this.form.controls['updated_on'].patchValue(data.history.updated_on)
            this.form.controls['updated_by'].patchValue(data.history.updated_by)
}

  cancel() {
    if (this.form.dirty === true){
        const dialogRef = this.dialog.open(MatDialogComponent,
            {
                data: {message: 'Are you sure you want to exit without saving Data ?', title: 'Unsaved Data', rightButtonText: 'No'},
                disableClose: true, width: '500px', position: {
                    top: '50px'
                },
                panelClass: 'inner-no-pad-dialog',
                autoFocus: false
            })
        dialogRef.afterOpened().subscribe(
                opend => {
                    document.querySelector('.inner-no-pad-dialog').parentElement.classList.add('no-relv')
                }
            )
        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.dialogRef.close()
            } else {
            }
        });

    } else {

        this.dialogRef.close();
    }
  }

  submit(formData){
    let operation$: Observable<any>;
    operation$ = this.saveBttn === 'Update' ?
    this.menuService.updateMenuItem(formData.DocId, formData) :
    this.menuService.createMenuItem(formData);
    console.log(formData)

operation$
    .pipe(
        takeWhile(_ => this.alive),
    )
    .subscribe((res: any) => {
            if (res.Success === true) {
                this.toasterService.pop('success', 'Success!', res.Message);
                if ( this.saveBttn === 'Create') {
        
                }
                this.patchFormData(res.Data)
                this.saveBttn = 'Update';
                this.form.markAsPristine()
                this.reloadGrid.emit(true)

            } else {

                this.showMessages.error = true;
                this.toasterService.pop('error', res.Message);
                this.errors = [res.Message];
            }
        },
        (error) => {
            this.toasterService.pop('error', 'Something went wrong!', 'Please try again.');
        },
    )
    }


    createForm() {
        this.form = this.fb.group({
            _type: [],
             _id: [] ,
             DocId: [] ,
             disabled: [] ,
             created_on : [],
             created_by : [],
             updated_on: [],
             updated_by : [],
             admin: [],
             name: [, Validators.required],
             description : [, Validators.required],
             link: [, Validators.required],
             parent : [, Validators.required],
             level: [, Validators.required],
             position: [, Validators.required],
             class: [],
             style:[],
             icon: [],
             iconlibary: [],
             tooltip: [] })

    }

}
