import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersSidebarComponent } from './filters-sidebar.component';

describe('DivorceLeadFiltersSidebarComponent', () => {
  let component: FiltersSidebarComponent;
  let fixture: ComponentFixture<FiltersSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
