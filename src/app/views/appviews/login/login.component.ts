import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showMessages: any = {};
    errors: string[] = [];
    messages: string[] = [];

    currentYear = new Date().getFullYear();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rsakey: ['']
        });

        // redirect to home if logged in already
        this.authService.isAuthenticated().subscribe(isLoggedIn => {
            if (isLoggedIn) {
                this.authService.checkTokenValidity().subscribe((res: any) => {
                    if (res.length > 0) {
                        this.router.navigateByUrl(''); // will redirect to home
                    }
                });
            }
        });

        // get return url from route parameters or default to '/starterview'
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/starterview';
    }

    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.errors = this.messages = [];
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.login(this.f.username.value, this.f.password.value, this.f.rsakey.value)
            .subscribe(
                response => {
                    console.log(response);
                    this.loading = false;
                    this.submitted = false;
                    if (response.Success) {
                        this.authService.getCurrentUser()
                            .subscribe((user) => {
                                    if (user) {
                                        this.showMessages.success = true;
                                        this.messages = ['You are logged in.'];
                                        this.router.navigate(['/home']);
                                    } else {
                                        this.authService.logout();
                                        this.errors = ['Something went wrong, please try again.'];
                                    }
                                },
                                error => {
                                    this.handleError(error);
                                });
                    } else {
                        this.handleError(new Error(response.message));
                    }
                },
                error => {
                    this.loading = false;
                    this.submitted = false;
                    this.handleError(error);
                });
    }

    handleError(error) {
        console.log(error);
        this.showMessages.error = true;
        this.errors = [error.message];
    }

}
