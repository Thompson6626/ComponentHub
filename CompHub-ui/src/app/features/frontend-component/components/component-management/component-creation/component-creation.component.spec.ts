import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCreationComponent } from './component-creation.component';

describe('ComponentCreationComponent', () => {
  let component: ComponentCreationComponent;
  let fixture: ComponentFixture<ComponentCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
