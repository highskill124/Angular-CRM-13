import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../../../services/admin.service';
import {Observable} from 'rxjs';
import {CouchbaseLookupService} from '../../../../services/couchbase-lookup.service';
import {takeWhile} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {CustomValidators} from './custom-validators';
import {IPasswordProfile} from '../../../../models/admin'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';


@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
    public passwordForm: FormGroup;
    alive = false;
    newPasswordHide = true
    oldPasswordHide = true
    confirmPasswordHide = true
    showDetail = true

    paswdProfile$: Observable<IPasswordProfile>
    paswdProfile: IPasswordProfile

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<PasswordComponent>,
                private adminService: AdminService, private route: ActivatedRoute, private cbLookupService: CouchbaseLookupService,
                private router: Router, private dialog: MatDialog, private toasterService: ToasterService, private fb: FormBuilder) {


    }


    ngOnInit() {
        // this.paswdProfile$ = this.adminService.getPasswordProfile("8084ea42-633e-4c28-bc7a-372aa58a4d1c")
        // this.paswdProfile$.subscribe(res => {this.paswdProfile = res[0]})
        this.paswdProfile$ = this.adminService.getPasswordProfile('8084ea42-633e-4c28-bc7a-372aa58a4d1c')
        this.paswdProfile$.subscribe(res => {
            this.paswdProfile = res,
                this.passwordForm = this.createPasswordForm(),
                this.alive = true
        })


    }

    createPasswordForm(): FormGroup {
        return this.fb.group(
            {
                oldPassword: [null, Validators.compose([Validators.required])],
                newPassword: [
                    null,
                    Validators.compose([
                        Validators.required,
                        // check whether the entered password has a number
                        CustomValidators.patternValidator(/\d/g, this.paswdProfile.numbers, {
                            hasNumber: true
                        }),
                        // check whether the entered password has upper case letter
                        CustomValidators.patternValidator(/[A-Z]/g, this.paswdProfile.upperCase, {
                            hasCapitalCase: true
                        }),
                        // check whether the entered password has a lower case letter
                        CustomValidators.patternValidator(/[a-z]/g, this.paswdProfile.lowerCase, {
                            hasSmallCase: true
                        }),
                        // check whether the entered password has a special character
                        CustomValidators.patternValidator(
                            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, this.paswdProfile.specialChar,
                            {
                                hasSpecialCharacters: true
                            }
                        ),
                        Validators.minLength(this.paswdProfile.minChar)
                    ])
                ],
                confirmPassword: [null, Validators.compose([Validators.required])]
            },
            {
                // check whether our password and confirm password match
                validator: CustomValidators.passwordMatchValidator
            }
        );
    }

    updatePassword() {

        console.log(this.passwordForm)
        // tslint:disable-next-line: label-position
        const myvalues: Object = this.passwordForm.value
        console.log(myvalues)
        this.adminService.updatePassword(myvalues).pipe(
            takeWhile(_ => this.alive),
        )
            .subscribe((res: any) => {
                    if (res.Success === true) {
                        this.toasterService.pop('success', 'Success!', res.Message);
                    } else {
                        this.toasterService.pop('error', res.Message);
                    }

                },
                error => {
                    this.toasterService.pop('error', error.Message);

                })
    }


    close() {
        this.dialogRef.close(0)
    }
}
