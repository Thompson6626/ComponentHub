import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe} from "@angular/common";
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {InputText} from "primeng/inputtext";
import {FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from '../../services/user.service';
import {AuthStateService} from '../../../../core/services/AuthState/auth-state.service';
import {ToastService} from '../../../../core/services/Toast/toast.service';
import {SimpleResponse} from '../../../../shared/models/simple-response';
import {UniqueUsernameValidator} from '../../../../shared/validators/unique-username';
import {
  differentOldAndNewPasswordValidator,
  samePasswordConfirmationValidator
} from '../../../../shared/utils/form-utils';
import {FormInputComponent} from '../../../../shared/components/form-input/form-input.component';

interface FormChangeUsernameModel{
  newUsername: FormControl<string>;
}

interface FormChangePasswordModel{
  oldPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmNewPassword: FormControl<string>;
}

@Component({
  selector: 'app-settings',
  imports: [
    AsyncPipe,
    Button,
    DatePipe,
    Dialog,
    InputText,
    ReactiveFormsModule,
    FormInputComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.sass'
})
export class SettingsComponent{

  changeUsernameVisible = false;
  changePasswordVisible = false;

  private formBuilder = inject(NonNullableFormBuilder);
  private userService = inject(UserService);
  private authStateService = inject(AuthStateService);
  private toastService = inject(ToastService);
  private uniqueUsernameValidator = inject(UniqueUsernameValidator);

  currentUser = this.authStateService.userDetails$;


  invalidUsernames = new Set<string>(['']);

  changeUsernameForm = this.formBuilder.group<FormChangeUsernameModel>({
    newUsername: this.formBuilder.control(
      '',
      Validators.required,
      this.uniqueUsernameValidator.validate.bind(this.uniqueUsernameValidator)
    ),
  },{ updateOn : "blur" })

  changePasswordForm = this.formBuilder.group<FormChangePasswordModel>({
    oldPassword: this.formBuilder.control('', Validators.required),
    newPassword: this.formBuilder.control('', Validators.required),
    confirmNewPassword: this.formBuilder.control('', Validators.required)
  },
    {
      validators: [
        differentOldAndNewPasswordValidator('oldPassword','newPassword'),
        samePasswordConfirmationValidator('newPassword','confirmNewPassword')
      ]}
  );


  showUsernameForm(){
    this.changeUsernameVisible = true;
  }

  showPasswordForm(){
    this.changePasswordVisible = true;
  }


  onChangeUsername(): void {
    const { newUsername } = this.changeUsernameForm.value;
    if (!newUsername) {
      return;
    }


    this.userService.updateUsername({ newUsername }).subscribe({
      next: (response: SimpleResponse) => {
        this.toastService.showSuccessToast('Success','Username changed successfully');
        this.closeUsernameFormDialog();
      },
      error:(error) =>{
        this.invalidUsernames.add(newUsername);
        this.toastService.showErrorToast('Error','Error updating username: ' + error.message);
      }
    });
  }

  onChangePassword(): void {

    const { oldPassword, newPassword, confirmNewPassword } = this.changePasswordForm.value;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return;
    }

    this.userService.updatePassword({ oldPassword, newPassword, confirmNewPassword }).subscribe({
      next: (data: SimpleResponse) => {
        this.toastService.showSuccessToast('Success', 'Password changed successfully');
        this.closePasswordFormDialog();
      },
      error: (error) => {
        console.log(error)
        this.toastService.showErrorToast('Error', 'Error updating password: ' + error.message);
      },
    });
  }

  closeUsernameFormDialog(){
    this.changeUsernameVisible = false;
    this.changeUsernameForm.reset();
  }

  closePasswordFormDialog(){
    this.changePasswordVisible = false;
    this.changePasswordForm.reset();
  }

  getUsernameChangeControl(name: string){
    return this.changeUsernameForm.get(name)! as FormControl<string>;
  }

  getPasswordChangeControl(name: string){
    return this.changePasswordForm.get(name)! as FormControl<string>;
  }


  goBack(){
    window.history.back();
  }
}
