import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthStateService} from '../../services/AuthState/auth-state.service';
import {first, map, take} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  return authStateService.isAuthenticated$.pipe(
    first(),
    map(isAuthenticated => {
      if (isAuthenticated){
        return true;
      }
      return router.createUrlTree(['/auth/login']);
    })
  );
};
