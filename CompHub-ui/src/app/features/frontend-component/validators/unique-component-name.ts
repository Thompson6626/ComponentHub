import {inject, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {catchError, map, Observable, of, switchMap, timer} from 'rxjs';
import {ComponentService} from '../services/ui-component/component.service';

@Injectable({providedIn: 'root'})
export class UniqueComponentNameValidator implements AsyncValidator {

  private componentService = inject(ComponentService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(700).pipe(switchMap(() =>{
      return this.componentService.alreadyHasComponentName(control.value).pipe(
        map((response) => (response.hasName ? { NameAlreadyInUse: true} : null)),
        catchError(() => of(null)),
      );
    }))
  }
}
