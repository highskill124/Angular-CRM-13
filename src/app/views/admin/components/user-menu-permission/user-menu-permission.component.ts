import { Component, NgZone, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {
  CheckableSettings ,
  TreeItemDropEvent,
  DropPosition,
  TreeItemLookup,
  DropAction,
} from '@progress/kendo-angular-treeview';
import { take } from 'rxjs/operators';
import { AdminService } from '../../../../services/admin.service';
import { Observable } from 'rxjs';
import { IUserList } from '../../../../models/user';
import { MenuService } from '../../../../services/menu.service';

@Component({
    selector: 'user-menu-permission',
    templateUrl: './user-menu-permission.component.html',
    styleUrls: ['./user-menu-permission.component.scss']
})
export class UserMenuPermissionComponent implements OnInit {

    public data: any[]
    public checkedKeys: any[] = [];
    public allParentNodes = [];
    public expandedKeys: any[] = this.allParentNodes.slice();

    public enableCheck = true;
    public checkChildren = false;
    public checkParents = false;
    public checkOnClick = false;
    public checkMode: any = 'multiple';
    public selectionMode: any = 'single';

    enableDragDrop = false;

    userList$: Observable<Array<IUserList>>
    form: FormGroup;


    public get checkableSettings(): CheckableSettings {
        return {
            checkChildren: this.checkChildren,
            checkParents: this.checkParents,
            enabled: this.enableCheck,
            mode: this.checkMode,
            checkOnClick: this.checkOnClick
        };
    }


    constructor(public zone: NgZone,
                private adminService: AdminService,
                private menuService: MenuService,
                private fb: FormBuilder) {}


    expand() {
        console.log(this.allParentNodes)
        this.expandedKeys = this.allParentNodes.slice();
      }
    collapse() {
        this.expandedKeys = [];
      }

      ngOnInit() {
        // this.getAllParentTextProperties(this.data);
        this.form = this.createForm()
        this.userList$ = this.adminService.getListOfAllUser()
        //this.expandedKeys = this.allParentNodes.slice();
        // this.data.filter( item => {
        //   this.iratedObject(item)
        // })
      }

      getAllParentTextProperties(items: Array<any>) {

        items.forEach(i => {
          if (i.child) {
            this.allParentNodes.push(i.text);
            this.getAllParentTextProperties(i.child);
          }
        })
      }

      loadData(userId: string) {
        this.menuService.fetchMenuItemUser(userId).subscribe(data => {
          this.data = data;
          this.getAllParentTextProperties(this.data);
          this.expandedKeys = this.allParentNodes.slice();
          this.checkedKeys = []
          this.data.filter( item => {
            this.iratedObject(item)
          })
        })
      }

      iratedObject(obj) {
        for (const prop in obj) {
          if (typeof(obj[prop]) === 'object') {
            this.iratedObject(obj[prop]);
          } else {
            if (obj['enabled'] === true && prop === 'guid') {
              this.checkedKeys.push(obj['guid'])
            }
        }}
      }

      createForm(): FormGroup {
        return this.fb.group(
            {
                user_id: [],
                permission: [],
            })

    }

    
      // Load Data based on GUID of Drop Down
      onInputChange(e){
        // TODO: Check if there is any unsaved Data before loading new Data
        console.log(e)
        this.loadData(e);
      }
      handleChecking2(e) {

        this.checkStatus(e.item.dataItem.guid)
      }

      checkStatus(item) {
          let enabled: boolean
          if (this.checkedKeys.indexOf(item) !== -1) {
           console.log( item + ' is checked ')
           enabled = true
            } else {
            console.log(item + ' is not checked ');
            enabled = false
          }

          console.log(this.form.value.user_id)

          this.menuService.updateUserMenuItem(this.form.value.user_id, item, enabled).subscribe(res => console.log(res))


      }

      handleChecking(e) {

        this.zone.onStable.pipe(take(1)).subscribe(() => {
          this.checkStatus(e.item.dataItem.guid)
        } )
      }

      printDebug(treeView, form) {
      console.log(form);
    }

}
