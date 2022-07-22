import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {environment} from '../../environments/environment';
import {takeWhile} from 'rxjs/operators';
import {SocketService} from '../services/socket.service';

@Injectable()
export class SocketInterceptor implements HttpInterceptor, OnDestroy {

    updatingSocketId = false;
    previousSocketId = null;

    alive = true;

    constructor(private authService: AuthService, private http: HttpClient, private socketService: SocketService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const socketId = this.socketService.socketId;
        if (socketId) {
            request = request.clone({
                setHeaders: {
                    'x-socket-id': socketId,
                }
            });
        }

        this.authService.isAuthenticated()
            .pipe(
                takeWhile(_ => this.alive),
            )
            .subscribe((loggedIn) => {
                if (loggedIn && socketId && (socketId !== this.previousSocketId) && !this.updatingSocketId) {
                    this.updatingSocketId = true;
                    // update previous socket id value
                    this.previousSocketId = socketId;
                    this.http.post(`${environment.apiUrl}/socketupdate`, {}, {headers: request.headers})
                        .pipe(
                            takeWhile(_ => this.alive),
                        )
                        .subscribe((resp: any) => {
                                // console.log(resp);
                                this.updatingSocketId = false;
                            },
                            error => {
                                this.updatingSocketId = false;
                            }
                        );
                }
            });

        return next.handle(request);
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}
