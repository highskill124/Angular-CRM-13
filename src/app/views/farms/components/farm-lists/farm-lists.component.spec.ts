import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmListsComponent } from './farm-lists.component';

describe('IgGridTestComponent', () => {
  let component: FarmListsComponent;
  let fixture: ComponentFixture<FarmListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
