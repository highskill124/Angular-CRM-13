import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExportActionComponent } from './data-export-action.component';

describe('AgGridSearchFilterComponent', () => {
  let component: DataExportActionComponent;
  let fixture: ComponentFixture<DataExportActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataExportActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExportActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
