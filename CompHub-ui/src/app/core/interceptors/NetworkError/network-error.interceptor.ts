import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {ToastService} from '../../services/Toast/toast.service';
import {catchError, EMPTY, throwError} from 'rxjs';

export const networkErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 0) {
        toastService.clearAll();
        toastService.showErrorToast(
          'Network Error',
          'Unable to reach the server. Please check your connection.',
          true
        );
      }

      // Re-throw the error to allow further handling
      return throwError(() => error);
    })
  );
};
