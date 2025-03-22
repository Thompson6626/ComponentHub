import {inject, Injectable} from '@angular/core';
import {UserService} from '../../features/user/services/user.service';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {catchError, map, Observable, of, switchMap, timer} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UniqueUsernameValidator implements AsyncValidator {

  private userService = inject(UserService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(700).pipe(
      switchMap(() => {
        return this.userService.isUsernameTaken(control.value).pipe(
          map((response) => (response.available ? null : {uniqueUsername: 'Username already taken'} )),
          catchError(() => of(null)),
        );
      })
    )
  }
}
