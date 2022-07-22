import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(catchError(err => {
          // console.log('error encountered ', err);
        if (err.status === 400 && err.error.message === 'Failed to authenticate token.') {
          this.router.navigateByUrl('/auth/login');
        }

        if (err.status === 401 && err.error.error === 'TokenExpiredError') {
          this.authService.logout();
            // location.reload(true);
        }

        let errorText = '';
        if (err.error) {
          errorText = err.error.message;
        } else if (err.statusText) {
          errorText = err.statusText;
        }
        return throwError(errorText ? errorText : err);
      }));
    }

    logout() {
      this.authService.logout();
    }
}
