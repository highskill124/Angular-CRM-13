import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridColumnsToggleComponent } from './columns-toggle.component';

describe('GridColumnsToggleComponent', () => {
  let component: GridColumnsToggleComponent;
  let fixture: ComponentFixture<GridColumnsToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridColumnsToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColumnsToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
