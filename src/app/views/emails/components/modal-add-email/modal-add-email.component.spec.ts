import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddEmailComponent } from './modal-add-email.component';

describe('ModalAddEmailComponent', () => {
  let component: ModalAddEmailComponent;
  let fixture: ComponentFixture<ModalAddEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
