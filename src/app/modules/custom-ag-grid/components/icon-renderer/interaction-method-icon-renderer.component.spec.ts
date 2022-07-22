import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionMethodIconRendererComponent } from './interaction-method-icon-renderer.component';

describe('InteractionMethodIconRendererComponent', () => {
  let component: InteractionMethodIconRendererComponent;
  let fixture: ComponentFixture<InteractionMethodIconRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionMethodIconRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionMethodIconRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
