import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAddConnectionComponent } from './action-add-connection.component';

describe('ActionAddEmailComponent', () => {
  let component: ActionAddConnectionComponent;
  let fixture: ComponentFixture<ActionAddConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionAddConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionAddConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
