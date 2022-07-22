import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketActionComponent } from './bucket-action.component';

describe('ActionAddEmailComponent', () => {
  let component: BucketActionComponent;
  let fixture: ComponentFixture<BucketActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
