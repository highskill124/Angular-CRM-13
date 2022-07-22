import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ApiService} from './api/api.service';
import 'rxjs-compat/add/operator/map';
import { map } from 'rxjs/operators';
import {IMenu, IMenuParents} from '../models/menu'
import { IApiResponseBody } from '../models/api-response-body';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    menu: Array<IMenuItem> = [];

    constructor(private http: HttpClient,
                public api: ApiService) {
    }

    getMenuItems(toreload = false): Observable<IMenuItem[]> {
        return new Observable((observer => {
            if (!toreload && this.menu.length > 0) {
                observer.next(this.menu);
                observer.complete();
            } else {
                this.fetchMenuItems().subscribe((items: Array<IMenuItem>) => {
                        this.menu = items;
                        this.menu.map(item => {
                            item.icon = item.icon ? item.icon : (item.name == 'Logout') ? 'exit_to_app' : '';
                            if(item.children) {
                                item.children.map(
                                    chitem => {
                                        chitem.icon = chitem.icon || '';          
                                        if(chitem.children) {
                                            chitem.children.map(
                                                gcitem => {
                                                    gcitem.icon = gcitem.icon ||  '';    
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        });
                        observer.next(items);
                        observer.complete();
                    },
                    (error) => {
                        console.log(error);
                    });
            }
        }));
    }

    // private fetchMenuItems() {
    //     return this.http.get(`${environment.apiUrl}/getmenu`).map((items: any) => {
    //         console.log(items)
    //         return this.createMenuObject(items.menu.parent);
    //     });
    // }

    private fetchMenuItems() {
        return this.http.get(`${environment.socketUrl}/menu/web`).map((items: any) => {
            return this.createMenuObject(items.Data.menu.parent);
        });
    }

    fetchMenuItem(DocId: string) {
        return this.api.get({endpoint: `/menu/menuitem/${DocId}`}).pipe(
            map(res => res as IApiResponseBody),
            map(res => res.Data as IMenu),
        );
    }

    fetchMenuItemUser(userId: string) {
        return this.api.get({endpoint: `/menu/menulistuser/${userId}`}).pipe(
            map(res => res as IApiResponseBody),
            map(res => res.Data as any),
        );
    }

    createMenuItem(formData: Partial<IMenu>) {
        return this.api.post({endpoint: `/menu/menuitem`, body: formData, useAuthUrl: false})
        .pipe(
            map((res: any) => {
                console.log(res);
                return res;
            })
        );
    }
    deleteMenuItem(DocId: string) {
        return this.api.delete({endpoint: `/menu/menuitem/${DocId}`, useAuthUrl: false})
        .pipe(
            map((res: any) => {
                console.log(res);
                return res;
            })
        );
    }

    updateMenuItem(DocId: string, data: Partial<IMenu>) {
        return this.api.patch({endpoint: `/menu/menuitem/${DocId}`, body: data, useAuthUrl: false})
        .pipe(
            map((res: any) => {
                console.log(res);
                return res;
            })
        );
    }

    updateUserMenuItem(userId: string, menuId: string, enabled: boolean) {
        return this.api.patch({endpoint: `/menu/usermenuitem/${userId}/${menuId}/${enabled}`, body: '', useAuthUrl: false})
        .pipe(
            map((res: any) => {
                console.log(res);
                return res;
            })
        );


    }



    fetchMenuParents(){
        return this.api.get({endpoint: `/menu/menuitems`}).pipe(
            map(res => res as IApiResponseBody),
            map(res => res.Data as Array<IMenuParents>),
        ); 
    }

    private createMenuObject(items) {
        const menuObject = [];
        items.forEach((item) => {
            menuObject.push({
                name: item.name,
                description: item.description,
                link: item.link,
                level: item.level,
                icon: item.image,
                position: item.position,
                imagelibary : item.imagelibary,
                tooltip: item.tooltip,
                class: item.class,
                children: item.child ? this.createMenuObject(item.child.menuitem) : [],
            });
        });

        return menuObject.sort((a, b) => {
            if (a.position < b.position) {
                return -1;
            }
            if (a.position > b.position) {
                return 1;
            }
            return 0;
        });
    }
}


export interface IMenuItem {
    name: string;
    description: string;
    link: string;
    level: number;
    position: number;
    children: Array<IMenuItem>;
    icon?: string;
    imagelibary?: string;
    tooltip?: string;
    class?: string;

}
