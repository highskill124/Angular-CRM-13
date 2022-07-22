import {Component, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../models/user';
import {
    ConnectedPositioningStrategy,
    GlobalPositionStrategy,
    HorizontalAlignment,
    IgxDropDownComponent,
    IgxOverlayOutletDirective,
    IgxOverlayService,
    NoOpScrollStrategy,
    OverlaySettings,
    VerticalAlignment
} from 'igniteui-angular';

@Component({
    selector: 'app-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit, OnDestroy {

    @Input() user: User;
    @ViewChild(IgxOverlayOutletDirective) public igxOverlayOutlet: IgxOverlayOutletDirective;
    @ViewChild(IgxDropDownComponent) public menu: IgxDropDownComponent;

    alive = true;

    private positionSettings = {
        horizontalDirection: HorizontalAlignment.Left,
        horizontalStartPoint: HorizontalAlignment.Right,
        verticalStartPoint: VerticalAlignment.Bottom
    };

    private quickActionPositionStrategy: GlobalPositionStrategy;

    constructor(
        @Inject(IgxOverlayService) private overlayService: IgxOverlayService,
    ) {
        // this.socketInit();
        const horizontalDirection = 0;
        const verticalDirection = -1;
        this.quickActionPositionStrategy = new GlobalPositionStrategy({
            // target: this.directionDemo.nativeElement,
            horizontalDirection, verticalDirection
        });
    }

    ngOnInit() {
    }

    public toggleMenu(eventArgs) {
        const overlaySettings: OverlaySettings = {
            closeOnOutsideClick: true,
            modal: false,
            outlet: this.igxOverlayOutlet,
            positionStrategy: new ConnectedPositioningStrategy(this.positionSettings),
            scrollStrategy: new NoOpScrollStrategy()
        };

        overlaySettings.positionStrategy.settings.target = eventArgs.target;
        this.menu.toggle(overlaySettings);
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
