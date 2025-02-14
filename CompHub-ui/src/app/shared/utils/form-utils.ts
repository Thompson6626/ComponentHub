import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return  (control.value || '').trim().length ? { blank : true} : null;
  };
}

export function isTouchedAndIsRequired(field: string, form: FormGroup){
  return isTouchedAndHasError(field,form,'required');
}

export function isTouchedAndHasError(field: string, form: FormGroup, error: string){
  const control = form.get(field);
  return control && control.touched && control.hasError(error);
}
