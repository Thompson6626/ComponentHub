import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject, PLATFORM_ID} from '@angular/core';
import {AuthService} from '../../../features/authentication/services/Auth/auth.service';
import {catchError, switchMap, tap, throwError} from 'rxjs';
import { isPlatformServer } from '@angular/common';
import {TokenService} from '../../../features/authentication/services/Token/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId) || req.headers.has('Authorization')) {
    return next(req);
  }

  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const token = tokenService.getAccessToken();
  const refresh = tokenService.getRefreshToken();

  if (token && !tokenService.isAccessTokenExpired()) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(req);
  } else if (refresh && !tokenService.isRefreshTokenExpired()) {
    return authService.refreshToken().pipe(
      switchMap(response => {
        tokenService.saveTokens(response);
        const newRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${response.access_token}` }
        });
        return next(newRequest);
      }),
      catchError(error => {
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  return next(req);
};


