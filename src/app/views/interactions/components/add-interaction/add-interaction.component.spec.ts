import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInteractionComponent } from './add-interaction.component';

describe('ModalAddPhoneNumberComponent', () => {
  let component: AddInteractionComponent;
  let fixture: ComponentFixture<AddInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
