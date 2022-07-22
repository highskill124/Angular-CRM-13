import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../../../services/admin.service';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {takeWhile} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

export interface Emails {
    id?: string;
    parentId: string;
    address: string;
    name: string;
    dflt: boolean;
    type: string;
}

@Component({
    selector: 'app-admin-email-edit',
    templateUrl: './admin-email-edit.component.html',
    styleUrls: ['./admin-email-edit.component.scss']
})
export class AdminEmailEditComponent implements OnInit {

    emailEditForm: FormGroup;
    typeList: IServerDropdownOption[] = [];
    alive = true;
    mode = 'Edit'
    modes = {New: 'New Email Test', Edit: 'Update Email Test', Duplicate: 'Duplicate current Email'};


    @Output() reloadUser: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AdminEmailEditComponent>,
                private adminService: AdminService, private route: ActivatedRoute, private cbLookupService: CouchbaseLookupService,
                private router: Router, private dialog: MatDialog, private toasterService: ToasterService, private fb: FormBuilder) {


    }

    ngOnInit() {
        console.log(this.data)
        this.emailEditForm = this.createUserForm()
        this.getTypeList('40A4CBD1-E62B-4BE6-9A97-B3D4AB87CE01')
        if (this.data.mode === 'edit') {
            this.mode = 'Edit'
        } else {
            this.mode = 'New'
        }

    }

    createUserForm(): FormGroup {
        return this.fb.group(
            {
                address: [this.data.address, [Validators.required, Validators.email]],
                name: [this.data.name],
                type: [this.data.type, Validators.required],
                dflt: [this.data.dflt],
            })
    }

    getTypeList(guid: string) {
        this.cbLookupService.getOptions(guid).subscribe((response: any) => {
            // tslint:disable-next-line:no-string-literal
            console.log(response);
            this.typeList = response
        })
    }

    saveEmail() {
        const updateEmail: Emails = {
            id: this.data.id,
            parentId: this.data.parentId,
            address: this.emailEditForm.get('address').value,
            type: this.emailEditForm.get('type').value,
            dflt: this.emailEditForm.get('dflt').value,
            name: this.emailEditForm.get('name').value
        }

        if (this.mode === 'Edit') {

            this.adminService.updateUserEmail(updateEmail).pipe(
                takeWhile(_ => this.alive),
            )
                .subscribe((res: any) => {
                        if (res.Success === true) {
                            this.toasterService.pop('success', 'Success!', res.Message);
                            this.reloadUser.emit(true)
                        } else {
                            this.toasterService.pop('error', res.Message);
                        }
                    },
                    error => {
                        this.toasterService.pop('error', error.Message);
                    })

        } else {
            this.adminService.newUserEmail(updateEmail).pipe(
                takeWhile(_ => this.alive),
            )
                .subscribe((res: any) => {
                        if (res.Success === true) {
                            this.toasterService.pop('success', 'Success!', res.Message);
                            this.mode = 'Edit'
                            this.data.id = res.Data.id
                            this.reloadUser.emit(true)
                        } else {
                            this.toasterService.pop('error', res.Message);
                        }
                    },
                    error => {
                        this.toasterService.pop('error', error.Message);
                    })
        }
    }

    close() {
        this.dialogRef.close()
    }
}
