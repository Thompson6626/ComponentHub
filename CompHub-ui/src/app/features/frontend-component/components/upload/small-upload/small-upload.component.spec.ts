import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallUploadComponent } from './small-upload.component';

describe('SmallUploadComponent', () => {
  let component: SmallUploadComponent;
  let fixture: ComponentFixture<SmallUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
