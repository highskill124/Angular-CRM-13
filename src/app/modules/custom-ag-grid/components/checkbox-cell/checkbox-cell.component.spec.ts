import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxCellComponent } from './checkbox-cell.component';

describe('CheckboxCellComponent', () => {
  let component: CheckboxCellComponent;
  let fixture: ComponentFixture<CheckboxCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
