import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmListsTestComponent } from './farm-lists.component';

describe('IgGridTestComponent', () => {
  let component: FarmListsTestComponent;
  let fixture: ComponentFixture<FarmListsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmListsTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmListsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
