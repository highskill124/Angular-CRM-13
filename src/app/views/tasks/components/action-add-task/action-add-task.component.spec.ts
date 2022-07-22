import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAddTaskComponent } from './action-add-task.component';

describe('ActionAddEmailComponent', () => {
  let component: ActionAddTaskComponent;
  let fixture: ComponentFixture<ActionAddTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionAddTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
