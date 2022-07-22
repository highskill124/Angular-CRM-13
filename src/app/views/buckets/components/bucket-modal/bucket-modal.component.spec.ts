import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketModalComponent } from './bucket-modal.component';

describe('ModalAddPhoneNumberComponent', () => {
  let component: BucketModalComponent;
  let fixture: ComponentFixture<BucketModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
