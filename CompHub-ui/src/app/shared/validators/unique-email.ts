import {inject, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {UserService} from '../../features/user/services/user.service';
import {catchError, map, Observable, of, switchMap, timer} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UniqueEmailValidator implements AsyncValidator {

  private userService = inject(UserService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(700).pipe(
      switchMap(() =>{
        return this.userService.isEmailAssociated(control.value).pipe(
          map((response) => (response.available ? null: {uniqueEmail: 'Email already associated with an account.'} )),
          catchError(() => of(null)),
        );
      })
    );
  }
}
