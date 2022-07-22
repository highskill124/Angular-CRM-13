import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivorceLeadFiltersSidebarComponent } from './divorce-lead-filters-sidebar.component';

describe('DivorceLeadFiltersSidebarComponent', () => {
  let component: DivorceLeadFiltersSidebarComponent;
  let fixture: ComponentFixture<DivorceLeadFiltersSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivorceLeadFiltersSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivorceLeadFiltersSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
