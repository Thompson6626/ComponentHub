import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject, PLATFORM_ID} from '@angular/core';
import {AuthService} from '../../features/authentication/services/auth.service';
import {catchError, switchMap, throwError} from 'rxjs';
import { isPlatformServer } from '@angular/common';

const excludedUrls = ['/auth/login', '/auth/register','auth/verify-email'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID)
  const authService = inject(AuthService)

  if(isPlatformServer(platformId)){
    return next(req);
  }

  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded){
    return next(req);
  }

  const token = authService.getAccessToken();

  if (token){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        return authService.refreshToken().pipe(
          switchMap(newToken => {
            const updatedHeaders = req.headers.set(
              'Authorization',
              `Bearer ${newToken.access_token}`,
            );
            const newRequest = req.clone({ headers: updatedHeaders });
            return next(newRequest);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
