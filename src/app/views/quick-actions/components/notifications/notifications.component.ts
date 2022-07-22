import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from '../../../../services/socket.service';
import {INotifyCount} from '../../../../models/notify-count';
import {
    ConnectedPositioningStrategy,
    GlobalPositionStrategy,
    HorizontalAlignment,
    IgxOverlayService,
    ISelectionEventArgs,
    NoOpScrollStrategy,
    OverlaySettings,
    VerticalAlignment
} from 'igniteui-angular';
import {ApiService} from '../../../../services/api/api.service';
import {NotificationService} from '../../../../services/notification.service';
import {takeWhile, tap} from 'rxjs/operators';
import {INotification} from '../../../../models/notification';
import {Observable} from 'rxjs';
import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

    alive = true;

    overlaySettings: OverlaySettings;
    positionSettings = {
        horizontalDirection: HorizontalAlignment.Left,
        horizontalStartPoint: HorizontalAlignment.Right,
        verticalStartPoint: VerticalAlignment.Bottom
    };
    private quickActionPositionStrategy: GlobalPositionStrategy;
    notifications$: Observable<INotification[]>;
    notifications: INotification[];
    notificationsCount;

    constructor(
        @Inject(IgxOverlayService) private overlayService: IgxOverlayService,
        private toasterService: ToasterService,
        private socketService: SocketService,
        private apiService: ApiService,
        private notificationService: NotificationService,
    ) {
        this.socketInit();
        const horizontalDirection = 0;
        const verticalDirection = -1;
        this.quickActionPositionStrategy = new GlobalPositionStrategy({
            // target: this.directionDemo.nativeElement,
            horizontalDirection, verticalDirection
        });
    }

    ngOnInit() {
        this.overlaySettings = {
            closeOnOutsideClick: true,
            modal: false,
            positionStrategy: new ConnectedPositioningStrategy(this.positionSettings),
            scrollStrategy: new NoOpScrollStrategy()
        };
    }

    socketInit() {
        this.socketService.ioInject('notifyCount', (notifyCount: INotifyCount) => {
            console.log('notifications count data ', notifyCount);
            this.notificationsCount = notifyCount.count;
        });
        this.socketService.ioInject('notifyMessage', (notifyMessage: INotification) => {
            console.log('notify message data ', notifyMessage);
            this.toasterService.pop('info', notifyMessage.subject, notifyMessage.message);
        });
    }

    fetchNotifications() {
        this.notifications$ = this.notificationService.getAll().pipe(
            tap(res => {
                this.notifications = res;
                console.log(res);
            }),
        );
    }

    public onSelection(eventArgs: ISelectionEventArgs) {
        eventArgs.cancel = true;
        switch (eventArgs.newSelection.value.type) {
            case 'new-contact':
                //
                break;
            case 'new-mail':
                //
                break;
            default:
                console.log(eventArgs.newSelection.value.type, eventArgs.newSelection.value);
                break;
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    markAsRead(item: INotification) {
        this.notificationService.update({DocId: item.DocId})
            .pipe(
                takeWhile(_ => this.alive),
                tap(res => {
                    this.fetchNotifications();
                }),
            )
            .subscribe();
    }

    deleteNotification(item: INotification) {
        this.notificationService.delete(item.DocId)
            .pipe(
                takeWhile(_ => this.alive),
                tap(res => {
                    // this.fetchNotifications();
                    this.notifications = this.notifications.filter(notification => {
                        return item.DocId !== notification.DocId;
                    });
                }),
            )
            .subscribe();
    }
}
