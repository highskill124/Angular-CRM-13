import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../../../services/admin.service';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {takeWhile} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {IServerDropdownOption} from '../../../../models/server-dropdown';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

export interface Phone {
    id?: string;
    parentId: string;
    number: string;
    name: string;
    dflt: boolean;
    type: string;
    sms: boolean;
}

@Component({
    selector: 'app-phone-edit',
    templateUrl: './phone-edit.component.html',
    styleUrls: ['./phone-edit.component.scss']
})
export class PhoneEditComponent implements OnInit {

    phoneEditForm: FormGroup;
    typeList: IServerDropdownOption[] = [];
    alive = true;
    mode = 'Edit'
    modes = {New: 'Create New Phone', Edit: 'Update Phone Number', Duplicate: 'Duplicate current Email'};


    @Output() reloadUser: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<PhoneEditComponent>,
                private adminService: AdminService, private route: ActivatedRoute, private cbLookupService: CouchbaseLookupService,
                private router: Router, private dialog: MatDialog, private toasterService: ToasterService, private fb: FormBuilder) {


    }

    ngOnInit() {
        this.phoneEditForm = this.createPhoneForm()
        this.getTypeList('0D8E2055-5834-4589-8A9E-56FF6BDD6325')
        if (this.data.mode === 'edit') {
            this.mode = 'Edit'
        } else {
            this.mode = 'New'
        }

    }

    createPhoneForm(): FormGroup {
        return this.fb.group(
            {
                number: [this.data.number, Validators.required],
                name: [this.data.name],
                type: [this.data.type, Validators.required],
                dflt: [this.data.dflt],
                sms: [this.data.sms],
            })
    }

    getTypeList(guid: string) {
        this.cbLookupService.getOptions(guid).subscribe((response: any) => {
            // tslint:disable-next-line:no-string-literal
            console.log(response);
            this.typeList = response
        })
    }

    savePhone() {
        const updatePhone: Phone = {
            id: this.data.id,
            parentId: this.data.parentId,
            number: this.phoneEditForm.get('number').value,
            type: this.phoneEditForm.get('type').value,
            dflt: this.phoneEditForm.get('dflt').value,
            name: this.phoneEditForm.get('name').value,
            sms: this.phoneEditForm.get('sms').value
        }
        console.log(updatePhone)

        if (this.mode === 'Edit') {

            this.adminService.updateUserPhone(updatePhone).pipe(
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
            this.adminService.newUserPhone(updatePhone).pipe(
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
