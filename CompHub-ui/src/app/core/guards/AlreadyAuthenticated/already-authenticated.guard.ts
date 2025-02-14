import { CanActivateChildFn } from '@angular/router';
import {inject} from '@angular/core';
import {AuthStateService} from '../../services/AuthState/auth-state.service';
import {map, take} from 'rxjs';

export const alreadyAuthenticatedGuard: CanActivateChildFn = (childRoute, state) => {
  const authStateService = inject(AuthStateService);

  return authStateService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => !isAuthenticated)
  );
};
