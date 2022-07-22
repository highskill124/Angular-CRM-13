import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddTaskComponent } from './modal-add-task.component';

describe('ModalAddPhoneNumberComponent', () => {
  let component: ModalAddTaskComponent;
  let fixture: ComponentFixture<ModalAddTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
