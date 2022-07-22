import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../../../services/admin.service';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {takeWhile} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {PhoneEditComponent} from '../phone-edit/phone-edit.component'
import {AdminEmailEditComponent} from '../admin-email-edit/admin-email-edit.component'
import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { FroalaUploadService } from '../../../../services/froala-upload.service';
import { environment } from '../../../../../environments/environment';
import { ImageEditButtons, insertHtmlField, MailTemplateToolbarButtons, QuickMailToolbarButtons } from '../../../../models/froala';
import FroalaEditor from 'froala-editor';


export interface Emails {
    address: string;
    name: string;
    dflt: boolean;
    type: string;
}

export interface Phones {
    number: string;
    dflt: boolean;
    type: string;
    sms: boolean
}

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    userProfile: any
    userForm: FormGroup;
    hasData = false
    dataEmail: Emails[]
    dataPhone: Phones []
    alive = true
    panelPhoneOpenState = false
    panelEmailOpenState = false
    defaultPhone: any
    defaultEmail: any

    editorInstance: any;
    froalaOptions: Object;


    displayedColumns: string[] = ['address', 'name', 'type', 'dflt', 'actionsColumn'];
    displayedColumnsPhone: string[] = ['number', 'name', 'type', 'sms', 'dflt', 'actionsColumn'];

    constructor(private dialog: MatDialog,
                private adminService: AdminService,
                private route: ActivatedRoute,
                private cbLookupService: CouchbaseLookupService,
                private froalaUploadService: FroalaUploadService,
                private router: Router,
                private toasterService: ToasterService,
                private fb: FormBuilder) {
                
                this.setFroalaOptions(this);
    }


    ngOnInit() {
        this.loadData()

    }

    loadData() {
        this.adminService.getUserProfile().subscribe(res => {
            this.userProfile = res,
                console.log(res),
                this.userForm = this.createUserForm(),
                this.setinitalValue(),
                this.dataEmail = this.userProfile.emails,
                this.dataPhone = this.userProfile.phones,
                this.getDfltPhone(),
                this.getDfltEmail()
            this.hasData = true
        })
    }

    reloadData() {
        this.adminService.getUserProfile().subscribe(res => {
            this.userProfile = res,
                console.log(res),
                this.setinitalValue(),
                this.dataEmail = this.userProfile.emails,
                this.dataPhone = this.userProfile.phones,
                this.getDfltPhone()
            this.getDfltEmail()
        })
    }

    createUserForm(): FormGroup {
        return this.fb.group(
            {
                username: [],
                locked: [],
                admin: [],
                developer: [],
                rsa: [],
                f_name: ['', Validators.required],
                m_name: ['', Validators.required],
                l_name: ['', Validators.required],
                office_address_line_1: [],
                office_address_line_2: [],
                office_address_city: [],
                office_address_state: [],
                office_address_zip: [],
                mailing_address_line_1: [],
                mailing_address_line_2: [],
                mailing_address_city: [],
                mailing_address_state: [],
                mailing_address_zip: [],
                home_address_line_1: [],
                home_address_line_2: [],
                home_address_city: [],
                home_address_state: [],
                home_address_zip: [],
                email_signature: []
            })

    }

    setinitalValue() {
        if (this.userProfile && this.userProfile.home_address) {
            this.userForm.patchValue({
                home_address_line_1: this.userProfile.home_address.address_line_1 ? this.userProfile.home_address.address_line_1 : '',
                home_address_line_2: this.userProfile.home_address.address_line_2 ? this.userProfile.home_address.address_line_2 : '',
                home_address_city: this.userProfile.home_address.city ? this.userProfile.home_address.city : '',
                home_address_state: this.userProfile.home_address.state ? this.userProfile.home_address.state : '',
                home_address_zip: this.userProfile.home_address.zip ? this.userProfile.home_address.zip : '',
            })
        }
        if (this.userProfile && this.userProfile.office_address) {
            this.userForm.patchValue({
                office_address_line_1: this.userProfile.office_address.address_line_1 ? this.userProfile.office_address.address_line_1 : '',
                office_address_line_2: this.userProfile.office_address.address_line_2 ? this.userProfile.office_address.address_line_2 : '',
                office_address_city: this.userProfile.office_address.city ? this.userProfile.office_address.city : '',
                office_address_state: this.userProfile.office_address.state ? this.userProfile.office_address.state : '',
                office_address_zip: this.userProfile.office_address.zip ? this.userProfile.office_address.zip : '',
            })
        }
        if (this.userProfile && this.userProfile.mailing_address) {
            this.userForm.patchValue({
                mailing_address_line_1: this.userProfile.mailing_address.address_line_1 ? this.userProfile.mailing_address.address_line_1 : '',
                mailing_address_line_2: this.userProfile.mailing_address.address_line_2 ? this.userProfile.mailing_address.address_line_2 : '',
                mailing_address_city: this.userProfile.mailing_address.city ? this.userProfile.mailing_address.city : '',
                mailing_address_state: this.userProfile.mailing_address.state ? this.userProfile.mailing_address.state : '',
                mailing_address_zip: this.userProfile.mailing_address.zip ? this.userProfile.mailing_address.zip : ''
            })
        }

        this.userForm.patchValue({
            username: this.userProfile.username,
            locked: this.userProfile.security.locked ? this.userProfile.security.locked : false,
            admin: this.userProfile.security.admin ? this.userProfile.security.admin : false,
            rsa: this.userProfile.security.rsa ? this.userProfile.security.rsa : false,
            f_name: this.userProfile.name.fname,
            m_name: this.userProfile.name.mname,
            l_name: this.userProfile.name.lname,
            developer: this.userProfile.security.developer ? this.userProfile.security.developer : false,
            email_signature : this.userProfile.email_signature


        })
    }

    emailEdit(row) {


        row['parentId'] = this.userProfile._type + '::' + this.userProfile._id
        row['mode'] = 'edit'
        const dialogRef = this.dialog.open(AdminEmailEditComponent,
            {
                data: row,
                disableClose: false, width: '600px', position: {
                    top: '50px'
                },
            })
        // tslint:disable-next-line: member-ordering
        const sub = dialogRef.componentInstance.reloadUser.subscribe(() => {
            console.log('We got an emit')
            this.reloadData()

        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('We git an unsubscribe')
        });
    }


    emailDelete(row) {

        row['parentId'] = this.userProfile._type + '::' + this.userProfile._id

        const dialogRef = this.dialog.open(MatDialogComponent,
            {
                data: {
                    message: 'Are you sure you want to delete email <b>' + row.address + '</b> ?',
                    title: 'Delete can not be undon',
                    rightButtonText: 'No'
                },
                disableClose: true, width: '500px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
                autoFocus: false
            })
        console.log('Will Delete Bucket ' + row.address)

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                console.log('Will DELETE THIS RECORD');
                this.adminService.deleteUserEmail(row).subscribe((res: any) => {
                        if (res.Success === true) {
                            this.toasterService.pop('success', 'Success!', res.Message);
                            this.reloadData();
                        } else {
                            this.toasterService.pop('error', res.Message);
                        }
                    },
                    error => {
                        this.toasterService.pop('error', error.Message);
                    })
            } else {
                console.log('Will not DELETE THIS RECORD');
            }
        });

    }

    emailNew() {
        let row = {}
        row['parentId'] = this.userProfile._type + '::' + this.userProfile._id
        row['mode'] = 'new'
        const dialogRef = this.dialog.open(AdminEmailEditComponent,
            {
                data: row,
                disableClose: false, width: '600px', position: {top: '50px'}
            })
        // tslint:disable-next-line: member-ordering
        const sub = dialogRef.componentInstance.reloadUser.subscribe(() => {
            console.log('We got an emit')
            this.reloadData()

        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('We git an unsubscribe')
        });
    }


    emailDflt(row) {
        console.log(row)
        row['parentId'] = this.userProfile._type + '::' + this.userProfile._id
        console.log(row)
        this.adminService.setUserDefaultEmail(row).pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.reloadData();
                    } else {
                        this.toasterService.pop('error', res.Message);
                    }
                },
                error => {
                    this.toasterService.pop('error', error.Message);
                })


    }

    phoneEdit(row) {


        row['parentId'] = this.userProfile._type + '::' + this.userProfile._id
        row['mode'] = 'edit'
        const dialogRef = this.dialog.open(PhoneEditComponent,
            {
                data: row,
                disableClose: false, width: '600px', position: {
                    top: '50px'
                },
            })
        // tslint:disable-next-line: member-ordering
        const sub = dialogRef.componentInstance.reloadUser.subscribe(() => {
            console.log('We got an emit')
            this.reloadData()

        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('We git an unsubscribe')
        });
    }

    phoneNew() {
        let row = {}
        row['parentId'] = this.userProfile._type + '::' + this.userProfile._id
        row['mode'] = 'new'
        const dialogRef = this.dialog.open(PhoneEditComponent,
            {
                data: row,
                disableClose: false, width: '600px', position: {top: '50px'}
            })
        // tslint:disable-next-line: member-ordering
        const sub = dialogRef.componentInstance.reloadUser.subscribe(() => {
            console.log('We got an emit')
            this.reloadData()

        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('We git an unsubscribe')
        });
    }

    phoneDelete(row) {

        row['parentId'] = this.userProfile._type + '::' + this.userProfile._id

        const dialogRef = this.dialog.open(MatDialogComponent,
            {
                data: {
                    message: 'Are you sure you want to delete Phone ' + row.number + ' ?',
                    title: 'Delete can not be undon',
                    rightButtonText: 'No'
                },
                disableClose: true, width: '500px', position: {
                    top: '50px'
                },
                panelClass:'no-pad-dialog',
                autoFocus: false
            })
        console.log('Will Delete Phone' + row.number)

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                console.log('Will DELETE THIS RECORD');
                this.adminService.deleteUserPhone(row).subscribe((res: any) => {
                        if (res.Success === true) {
                            this.toasterService.pop('success', 'Success!', res.Message);
                            this.reloadData();
                        } else {
                            this.toasterService.pop('error', res.Message);
                        }
                    },
                    error => {
                        this.toasterService.pop('error', error.Message);
                    })
            } else {
                console.log('Will not DELETE THIS RECORD');
            }
        });

    }

    phoneDflt(row) {
        console.log(row)
        row['parentId'] = this.userProfile._type + '::' + this.userProfile._id
        console.log(row)
        this.adminService.setUserDefaultPhone(row).pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                        this.reloadData();
                    } else {
                        this.toasterService.pop('error', res.Message);
                    }
                },
                error => {
                    this.toasterService.pop('error', error.Message);
                })
    }


    getDfltPhone() {
        this.defaultPhone = this.dataPhone.filter(function (hero) {
            return hero.dflt === true;
        })


    }

    getDfltEmail() {
        this.defaultEmail = this.dataEmail.filter(function (hero) {
            return hero.dflt === true;
        })


    }

    saveUser() {
        console.log(this.userForm.value)
        this.adminService.updateUserProfile(this.userForm.value).subscribe((res: any) => {
            if(res.Success === true){
                this.toasterService.pop('success', 'Success!', res.Message);
                this.userForm.markAsPristine()
            } else {
                this.toasterService.pop('error', res.Error);
            }
            
        })
    }

    private setFroalaOptions(componentInstance) {
        this.froalaOptions = {
            key: environment.froala.license.version3,
            attribution: false,
            charCounter: true,
            charCounterCount: true,
            height: 200,
            imageOutputSize: true,
    
            /**
             * without this image edit buttons don't show
             * Note: This value should not be greater than the z-index value of overlay (modal) containers
             * to avoid them appearing behind the editor. Modal containers generally have z-index value 10.
             * @see https://www.smashingmagazine.com/2019/04/z-index-component-based-web-application/
             */
            zIndex: 20006,
            toolbarSticky: false,
            ...this.froalaUploadService.initUploadOptions(),
            ...this.froalaUploadService.initImageManagerOptions(),

            events: {
                'focus': function (e, editor) {
                    // componentInstance.editorInstance = editor;
                },
                'blur': function () {
                    // save selection so we can restore just before inserting any element
                    this.selection.save();
                },
                'initialized': function () {
                    componentInstance.editorInstance = this;
                },
                ...this.froalaUploadService.initImageManagerEvents(),
                ...this.froalaUploadService.initUploadEvents(),
            },
            toolbarButtons: QuickMailToolbarButtons ,


            // imageEditButtons: [...ImageEditButtons]
        };
    }


}
