import {SocketService} from './socket.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {User} from '../models/user';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import { IApiResponseBody } from '../models/api-response-body';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private userUrl = '/userinfo';

    constructor(private http: HttpClient, private router: Router, private socketService: SocketService) {
        // Will Check if we have a Token and only call socketInit if we do which avoids auth requests without token
        if (this.getStoredToken() !== null) {
            this.socketInit();
        }
    }

    socketInit() {
        this.socketService.socketInit()
        this.socketService.ioInject('connect', () => {
            this.socketService.emit('authenticate', this.getStoredToken());
        });
    }

    login(username: string, password: string, rsatoken: string) {
        return this.http.post(
            `${environment.socketUrl}/auth`,
            {user: username, password: password, rsatoken: rsatoken, type: 'api'}, {observe: 'response'}
        )
            .pipe(
                map((res: any) => {
                    if (res.body.Success) {
                        localStorage.setItem('token', JSON.stringify({token: res.body.Token}));
                        /**
                         * Re-establish socket connection since the previous one likely disconnected as API received no token
                         */
                        this.socketInit();
                    }

                    return res.body;
                })
            );
    }

    getCurrentUser(): Observable<User> {
        const currentUser = this.getStoredUser();

        return new Observable((observer) => {
            this.isAuthenticated()
                .subscribe((isLoggedIn: boolean) => {
                    if (isLoggedIn) {
                        if (!currentUser) {
                            this.fetchUser()
                                .subscribe((user: any) => {
                                        console.log(user);
                                        const newUser = new User(user);
                                        console.log('User Model: ', newUser);
                                        localStorage.setItem('currentUser', JSON.stringify(newUser));
                                        observer.next(newUser);
                                        observer.complete();
                                    },
                                    error1 => console.log(error1)
                                );
                        } else {
                            observer.next(currentUser);
                            observer.complete();
                        }
                    } else { // user is not logged in. Create an error for this?
                        observer.next(currentUser);
                        observer.complete();
                    }
                });
        });
    }

    checkTokenValidity() {
        return this.http.get(`${environment.apiUrl}/activetoken`, {});
    }

    isAuthenticated(): Observable<boolean> {
        return new Observable(observer => {
            const token = this.getStoredToken();

            if (token) {
                observer.next(true);
            } else {
                observer.next(false);
            }

            observer.complete();
        });
    }

    getStoredToken() {
        return localStorage.getItem('token');
    }

    getStoredUser() {
        const user: User = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.guid) {
            return user;
        }

        return null;
    }

    private removeAuthTokens() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
    }

    private fetchUser(): Observable<any> {
        return this.http.get(`${environment.apiUrl}${this.userUrl}`).map((res: IApiResponseBody) => {
            console.log(res.Data);
            return res.Data ; // user details is return as an array with one item
        });
    }

    logout() {
        this.isAuthenticated().subscribe(isLoggedIn => {
            if (isLoggedIn) {
                // Disconnect active Socket for this Client
                this.socketService.emit('clientDisco', '');
                this.http.post(`${environment.apiUrl}/logout`, {})
                    .subscribe(
                        res => {
                            this.removeAuthTokens();
                        },
                        error => {
                            this.removeAuthTokens();
                        },
                        () => {
                            this.router.navigateByUrl('/auth/login');
                        });
            } else {
                this.router.navigateByUrl('/auth/login');
            }
        });
    }
}
