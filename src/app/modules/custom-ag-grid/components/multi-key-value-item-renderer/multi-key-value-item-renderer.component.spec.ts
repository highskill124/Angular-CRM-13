import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiKeyValueItemRendererComponent } from './multi-key-value-item-renderer.component';

describe('MultiSelectItemRendererComponent', () => {
  let component: MultiKeyValueItemRendererComponent;
  let fixture: ComponentFixture<MultiKeyValueItemRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiKeyValueItemRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiKeyValueItemRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
