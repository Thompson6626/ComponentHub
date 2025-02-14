import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { alreadyAuthenticatedGuard } from './already-authenticated.guard';

describe('alreadyAuthenticatedGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => alreadyAuthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
