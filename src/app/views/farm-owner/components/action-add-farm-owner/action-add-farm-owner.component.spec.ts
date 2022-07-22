import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAddFarmOwnerComponent } from './action-add-farm-owner.component';

describe('ActionAddEmailComponent', () => {
  let component: ActionAddFarmOwnerComponent;
  let fixture: ComponentFixture<ActionAddFarmOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionAddFarmOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionAddFarmOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
