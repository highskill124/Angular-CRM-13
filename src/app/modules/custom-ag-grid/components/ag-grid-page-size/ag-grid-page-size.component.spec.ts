import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridPageSizeComponent } from './ag-grid-page-size.component';

describe('AgGridSearchFilterComponent', () => {
  let component: AgGridPageSizeComponent;
  let fixture: ComponentFixture<AgGridPageSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridPageSizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridPageSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
