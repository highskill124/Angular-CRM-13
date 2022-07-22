import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAddEmailComponent } from './action-add-email.component';

describe('ActionAddEmailComponent', () => {
  let component: ActionAddEmailComponent;
  let fixture: ComponentFixture<ActionAddEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionAddEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionAddEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
