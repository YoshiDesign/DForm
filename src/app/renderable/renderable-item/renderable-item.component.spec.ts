import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderableItemComponent } from './renderable-item.component';

describe('RenderableItemComponent', () => {
  let component: RenderableItemComponent;
  let fixture: ComponentFixture<RenderableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
