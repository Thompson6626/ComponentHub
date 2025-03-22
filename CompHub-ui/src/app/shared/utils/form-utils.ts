import {AbstractControl , ValidationErrors, ValidatorFn} from "@angular/forms";


export function differentOldAndNewPasswordValidator(oldPasswordKey:string, newPasswordKey:string): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null =>{
    const oldPasswordControl = control.get(oldPasswordKey);
    const newPasswordControl = control.get(newPasswordKey);

    if (!oldPasswordControl || oldPasswordControl.value.trim() === "" || !newPasswordControl || newPasswordControl.value.trim() === "" ){
      return null;
    }

    if(oldPasswordControl.value === newPasswordControl.value){
      newPasswordControl.setErrors({ OldNewSame: 'New password cannot be the same as old password.'});
    }

    return null;
  };
}

export function samePasswordConfirmationValidator(passwordKey: string, confirmKey: string): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null =>{

    const passwordControl = control.get(passwordKey);
    const confirmPasswordControl = control.get(confirmKey);

    if (!passwordControl || passwordControl.value.trim() === "" || !confirmPasswordControl || confirmPasswordControl.value.trim() === "" ){
      return null;
    }

    if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value){
      confirmPasswordControl.setErrors({ ConfirmPasswordMismatch: 'New password and confirm do not match' });
    }

    return null;
  };
}
