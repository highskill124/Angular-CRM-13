import {AfterContentInit, Component, ContentChildren, Input, OnInit, QueryList} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {FilterComponent, IActiveFilter} from '../filter/filter.component';

@Component({
  selector: 'app-filters-sidebar-container',
  templateUrl: './filters-sidebar-container.component.html',
  styleUrls: ['./filters-sidebar-container.component.scss'],
})
export class FiltersSidebarContainerComponent implements OnInit, AfterContentInit {

    resources: Observable<IActiveFilter[]>;
    isSidebarCollapsed = false;
    collapseStatusCssClass: 'is-collapsed' | 'is-open';
    toggleIcon: 'chevron_right' | 'chevron_left';
    @Input() enabled:boolean = false;
    @ContentChildren(FilterComponent, {descendants: true}) filterComponents: QueryList<FilterComponent>;
    // @Output() filtersChanged = new EventEmitter<IActiveFilter[]>();

  ngOnInit() {
    if(!this.enabled)
    this.isSidebarCollapsed=true;
      this.setCollapseStatusCssClass(this.isSidebarCollapsed);
      this.setToggleIcon(this.isSidebarCollapsed);
  }

  ngAfterContentInit(): void {
      const filters = this.filterComponents.map(f => f.changeFilter);

      this.resources = combineLatest([...filters]);
      // console.log('resources ', [this.resources, filters, filters.length]);
      // console.log('filter components', this.filterComponents);
  }

    /**
     * This is the only place in which the collapse status should be changed so everything is updated
     */
  toggleSidebarCollapsed() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      this.setCollapseStatusCssClass(this.isSidebarCollapsed);
      this.setToggleIcon(this.isSidebarCollapsed);
  }
    private setCollapseStatusCssClass(isSidebarCollapsed: boolean) {

        this.collapseStatusCssClass = isSidebarCollapsed ? 'is-collapsed' : 'is-open'
    }

    private setToggleIcon(isSidebarCollapsed: boolean) {
        this.toggleIcon = isSidebarCollapsed ? 'chevron_right' : 'chevron_left';
    }
}
