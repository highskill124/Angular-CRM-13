import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../../../services/admin.service';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {combineLatest, startWith, takeWhile} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {PhoneEditComponent} from '../phone-edit/phone-edit.component'
import {AdminEmailEditComponent} from '../admin-email-edit/admin-email-edit.component'
import {MatDialogComponent} from '../../../../modules/mat-dialog/mat-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FroalaUploadService } from '../../../../services/froala-upload.service';
import { environment } from '../../../../../environments/environment';
import { ImageEditButtons, insertHtmlField, MailTemplateToolbarButtons, QuickMailToolbarButtons } from '../../../../models/froala';
import FroalaEditor from 'froala-editor';


@Component({
    selector: 'app-user-quick-edit',
    templateUrl: './user-quick-edit.component.html',
    styleUrls: ['./user-quick-edit.component.scss']
})
export class UserQuickEditComponent implements OnInit {

    userProfile: any
    userForm: FormGroup;
    hasData = false
    alive = true
    mode = 'new'
    saveBttn = 'Create User'
    submitted = false



    @Output() reloadGrid: EventEmitter<boolean> = new EventEmitter<boolean>();



    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<UserQuickEditComponent>,
                private adminService: AdminService,
                private cbLookupService: CouchbaseLookupService,
                private toasterService: ToasterService,
                private fb: FormBuilder) {

                    this.userForm = fb.group({
                        userid:[],
                        username: [],
                        password: [],
                        locked: [],
                        admin: [],
                        developer: [],
                        rsa: [],
                        failed_login_count : [],
                        fname: ['', Validators.required],
                        mname: [''],
                        lname: ['', Validators.required],
                        email: ['']
          
                    })
}


    ngOnInit() {
        console.log(this.data)
        if(this.data.mode === 'edit'){
            this.mode = 'edit'
            this.loadData()
            this.saveBttn = 'Update User'

        } else {

            this.mode = 'new'
        }
        

    }

    getdfltEmail(data: any){
        console.log(data)
        if(data.emails && data.emails.length > 0){
            console.log('We have more then 1 Email')
            console.log(data.emails)
            if(data.emails.length === 1){
                return data.emails[0].address
            } else {
                let email = data.emails.find(e=>e.dflt === true);
                return email.address
            }
        }
    }

    loadData() {
        this.adminService.getUserAccount(this.data.DocId).subscribe(res => {
            this.userProfile = res,
                console.log(res),
                this.setinitalValue(res),
                
           
            this.hasData = true
        })
    }

    reloadData() {
        this.adminService.getUserProfile().subscribe(res => {
            this.userProfile = res,
                console.log(res),
                this.setinitalValue(res)
 
        })
    }

    

    setinitalValue(data: any) {
        

        this.userForm.patchValue({
            DocId: this.userProfile.DocId,
            userid: this.userProfile.id,
            username: this.userProfile.username,
            locked: this.userProfile.security.locked ? this.userProfile.security.locked : false,
            admin: this.userProfile.security.admin ? this.userProfile.security.admin : false,
            rsa: this.userProfile.security.rsa ? this.userProfile.security.rsa : false,
            password : this.userProfile.security.password ? this.userProfile.security.password : false,
            fname: this.userProfile.name.fname,
            mname: this.userProfile.name.mname,
            lname: this.userProfile.name.lname,
            developer: this.userProfile.security.developer ? this.userProfile.security.developer : false,
            failed_login_count: this.userProfile.security.failed_login_count,
            email: this.getdfltEmail(data)
       


        })
    }

   
    deleteToken(){
        this.adminService.deleteUserToken(this.userForm.value.userid).subscribe((res: any) => {
            if(res.Success === true){
                this.toasterService.pop('success', 'Success!', res.Message);
            
            } else {
                this.toasterService.pop('error', res.Error);
            }
            
        })

    }

    deleteGrid(){
        this.adminService.deleteUserGrid(this.userForm.value.userid).subscribe((res: any) => {
            if(res.Success === true){
                this.toasterService.pop('success', 'Success!', res.Message);
            
            } else {
                this.toasterService.pop('error', res.Error);
            }
            
        })

    }
    
    deleteMenu(){
        this.adminService.deleteUserMenu(this.userForm.value.userid).subscribe((res: any) => {
            if(res.Success === true){
                this.toasterService.pop('success', 'Success!', res.Message);
            
            } else {
                this.toasterService.pop('error', res.Error);
            }
            
        })

    }

    deleteAccount(){
        this.adminService.deleteUserAccount(this.userForm.value.userid).subscribe((res: any) => {
            if(res.Success === true){
                this.toasterService.pop('success', 'Success!', res.Message);
                this.reloadGrid.emit(true)
                this.dialogRef.close({ mode: this.saveBttn, reload: this.submitted })

            
            } else {
                this.toasterService.pop('error', res.Error);
            }
            
        })



    }

   

 

    saveUser() {
        console.log(this.userForm.value)
        if(this.saveBttn = 'Create User'){
            this.adminService.createUserAccount(this.userForm.value).subscribe((res: any) => {
                if(res.Success === true){
                    this.toasterService.pop('success', 'Success!', res.Message);
                    this.saveBttn = 'Update User'
                    this.userForm.markAsPristine()
                    this.reloadGrid.emit(true)
                    this.userForm.patchValue({userid: res.Data.DocId})
                 
                    this.submitted = true
                } else {
                    this.toasterService.pop('error', res.Error);
                }


            })


        } else {
            this.adminService.updateUserAccount(this.userForm.value).subscribe((res: any) => {
                if(res.Success === true){
                    this.toasterService.pop('success', 'Success!', res.Message);
                    this.reloadGrid.emit(true)
                    this.userForm.markAsPristine()
                    this.submitted = true
                } else {
                    this.toasterService.pop('error', res.Error);
                }
                
            })
        }
    
    }


    setInitials() {
        if(this.mode === 'new') {
            let username = this.userForm.value.fname.substring(0,1).toLowerCase() + this.userForm.value.lname.toLowerCase()
            username.replace(/\s/g, "")
            console.log('New Username : ' + username)
            this.userForm.patchValue({username: username})

        }
       
       
            
    }

    close() {
        
        if(this.submitted === true){
            this.reloadGrid.emit() 
        }
        
        this.dialogRef.close({ mode: this.saveBttn, reload: this.submitted })
    }


}
