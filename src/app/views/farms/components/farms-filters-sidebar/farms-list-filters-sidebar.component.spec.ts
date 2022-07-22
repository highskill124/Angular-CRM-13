import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmsListFiltersSidebarComponent } from './farms-list-filters-sidebar.component';

describe('DivorceLeadFiltersSidebarComponent', () => {
  let component: FarmsListFiltersSidebarComponent;
  let fixture: ComponentFixture<FarmsListFiltersSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmsListFiltersSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmsListFiltersSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
