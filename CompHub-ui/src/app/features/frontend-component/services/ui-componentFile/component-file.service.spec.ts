import { TestBed } from '@angular/core/testing';

import { ComponentFileService } from './component-file.service';

describe('ComponentFileService', () => {
  let service: ComponentFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
