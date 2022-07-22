import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketEditComponent } from './bucket-edit.component';

describe('BucketEditComponent', () => {
  let component: BucketEditComponent;
  let fixture: ComponentFixture<BucketEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
