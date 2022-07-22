import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismissibleContainerComponent } from './dismissible-container.component';

describe('DismissibleContainerComponent', () => {
  let component: DismissibleContainerComponent;
  let fixture: ComponentFixture<DismissibleContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismissibleContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismissibleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
