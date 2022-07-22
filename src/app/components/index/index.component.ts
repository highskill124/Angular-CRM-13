import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, NavigationStart, Router, Routes} from '@angular/router';
import {IgxNavigationDrawerComponent} from 'igniteui-angular';
import {filter, tap} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
import {IMenuItem, MenuService} from '../../services/menu.service';
import {User} from '../../models/user';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PasswordComponent} from '../../views/admin/components/password/password.component'
import {MatDialog} from '@angular/material/dialog';
import {
    IgxToggleDirective,
    ISelectionEventArgs
} from 'igniteui-angular';
import { StateService } from '../../services/header.service';

@Component({
    selector: 'app-index',
    styleUrls: ['./index.component.scss'],
    templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit {

    @ViewChild('navdrawer', {read: IgxNavigationDrawerComponent})
    public navdrawer: IgxNavigationDrawerComponent;

    public homeRouteItem: IMenuItem;

    public currentNavItems$: IMenuItem[] = [];

    public selectedDisplayName: string;

    public searchValue = '';

    public drawerState = {
        enableGestures: true,
        miniWidth: '80px',
        open: false,
        pin: false,
        pinThreshold: 768,
        position: 'left',
        width: '300px'
    };

    user$: Observable<User>;
    menu: IMenuItem[];
    environment = environment;
    userData: {}
    name: string;
    
    
    private appRoutes: Routes;

    private allNavItems: IMenuItem[] = [];
    @ViewChild('toggleDirectiveMenu') public toggleDirectiveMenu: IgxToggleDirective;
    constructor(
        private router: Router,
        private authService: AuthService,
        private menuService: MenuService,
        private dialog: MatDialog,
        private state: StateService
    ) {
        this.appRoutes = router.config;
        this.state.getTitle().subscribe( title => {this.name = title,
            console.log(title)})

        // this.currentNavItems$ = this.menuService.getMenuItems();
        this.reloadMenu();
        this.user$ = this.authService.getCurrentUser().pipe(
            tap( data => console.log(data))
        );
        
    }

    public onSelection(eventArgs: ISelectionEventArgs) {
        eventArgs.cancel = true;
        this.toggleDirectiveMenu.close();

    
        // this.router.navigate([{ outlets: {'quick_action': ['NewContact']}}]);
    }

    reloadMenu() {
        this.currentNavItems$ = [];
        this.menuService.getMenuItems(true).subscribe(
            res => {
                console.log(res)
                this.currentNavItems$ = res;
            }
        )
    }

    public ngOnInit() {
        // this.selectedDisplayName = this.name
     

        this.selectedDisplayName = this.router.routerState.snapshot.root.data['displayName'];
        if (this.selectedDisplayName === undefined ) {
            this.selectedDisplayName = this.name
        }
        /*const loadedRouteItem = this.appRoutes[1].children.filter(
            (route) => {
                console.log('index ', this.router.url.indexOf(route.path));
                return this.router.url.indexOf(route.path) !== -1;
            }
        )[0];
        if (loadedRouteItem && loadedRouteItem.data && loadedRouteItem.data.displayName) {
            this.selectedDisplayName = loadedRouteItem.data.displayName;
        }
        console.log('loaded item ', this.appRoutes[1], 'path ', this.router.url);*/

        this.router.events.pipe(
            filter((x) => x instanceof NavigationStart)
        ).subscribe((event: NavigationStart) => {
            // if (event.url !== '/' && !this.navdrawer.pin) {
            if (event.url !== '/') {
                // Close drawer when selecting a view on mobile (unpinned)
                this.navdrawer.close();
            }
        });

        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationEnd)
        ).subscribe(() => {
            let root = this.router.routerState.snapshot.root;
            while (root) {
                if (root.children && root.children.length) {
                    root = root.children[0];
                } else if (root.data && root.data['displayName']) {
                    this.selectedDisplayName = root.data['displayName'];
                    return;
                } else {
                    return;
                }
            }
        });

        // this.createAllNavItems();
    }

    public searchValueChanged() {
        // this.currentNavItems = this.filter(this.allNavItems);
    }

    public clearSearchValue() {
        this.searchValue = '';
        this.searchValueChanged();
    }

    // toggle a header element from the navigation
    public toggleParent(nodeId, type = "parent") {
        const theSpan = document.getElementById(nodeId);
        if(type == 'parent') {
            let childs:any = document.querySelectorAll('.menu-child-collapse');
            if(childs) {
                childs.forEach((chld) => { if(chld != theSpan)  chld.style.display = 'none'; } );
            }
        } else if ( type == 'child') {
            let gchilds:any = document.querySelectorAll('.menu-grand-collapse');
            if(gchilds) {
                gchilds.forEach((gchld) => { if(gchld != theSpan) gchld.style.display = 'none'; } );
            }
        }
        if (theSpan != null) {
            if (theSpan.style.display === 'inline') {
                theSpan.style.display = 'none';
            } else if (theSpan.style.display === 'none') {
                theSpan.style.display = 'inline';
            }
        }
    }

    // convert a header element's visibility to a material icon name
    public convertNodeStateToIcon(nodeId) {
        const theSpan = document.getElementById(nodeId);
        if (theSpan != null) {
            const theSpanDisplay = theSpan.style.display;
            if (theSpanDisplay === 'inline') {
                return 'remove';
            } else if (theSpanDisplay === 'none') {
                return 'add';
            }
        }
        return 'add';
    }

    public convertNodeStateToIconNew(nodeId) {
        const theSpan = document.getElementById(nodeId);
        if (theSpan != null) {
            const theSpanDisplay = theSpan.style.display;
            if (theSpanDisplay === 'inline') {
                return 'keyboard_arrow_right';
            } else if (theSpanDisplay === 'none') {
                return 'keyboard_arrow_down';
            }
        }
        return 'add';
    }

    private createAllNavItems() {
        // this.currentNavItems = this.allNavItems;
    }

    private sort(navItems: INavigationItem[]) {
        return navItems.sort((current, next) => {
            return current.name.toLowerCase().localeCompare(next.name.toLowerCase());
        });
    }

    editPassword() {

        this.user$.subscribe(res => this.userData = res)

        const dialogRef = this.dialog.open(PasswordComponent,
            {
                data: this.userData,
                disableClose: true, width: '600px', position: {
                    top: '50px'
                },
            })

    }


    activeRoute(routename: string): boolean {
        return this.router.url.indexOf(routename) > -1;
    }

    onLogout() {
        this.authService.logout();
    }
}

export interface INavigationItem {
    name: string;
    children: IRouteItem[];
}

export interface IRouteItem {
    path: string;
    displayName: string;
}
