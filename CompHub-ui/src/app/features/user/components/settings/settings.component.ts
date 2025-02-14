import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe} from "@angular/common";
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {InputText} from "primeng/inputtext";
import {Password} from "primeng/password";
import {FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from '../../services/user.service';
import {AuthStateService} from '../../../../core/services/AuthState/auth-state.service';
import {ToastService} from '../../../../core/services/Toast/toast.service';
import {noWhitespaceValidator} from '../../../../shared/utils/form-utils';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {SimpleResponse} from '../../../../shared/models/simple-response';

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
        Password,
        ReactiveFormsModule
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.sass'
})
export class SettingsComponent implements OnInit{

  changeUsernameVisible = false;
  changePasswordVisible = false;

  private formBuilder = inject(NonNullableFormBuilder);
  private userService = inject(UserService);
  private authStateService = inject(AuthStateService);
  private toastService = inject(ToastService);

  currentUser = this.authStateService.userDetails$;


  invalidUsernames = new Set<string>(['']);

  changeUsernameForm = this.formBuilder.group<FormChangeUsernameModel>({
    newUsername: this.formBuilder.control('', [Validators.required, noWhitespaceValidator]),
  })

  changePasswordForm = this.formBuilder.group<FormChangePasswordModel>({
    oldPassword: this.formBuilder.control('', [Validators.required, noWhitespaceValidator]),
    newPassword: this.formBuilder.control('', [Validators.required, noWhitespaceValidator]),
    confirmNewPassword: this.formBuilder.control('', [Validators.required, noWhitespaceValidator])
  });

  ngOnInit(): void {
    // Username form
    this.changeUsernameForm.get('newUsername')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.checkUsernameValidity(value);
      });

    // Passwords form
    this.changePasswordForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
      .subscribe((value) => {
        this.checkPasswordValidity(value);
      })
    ;

  }

  checkPasswordValidity(passwords: Partial<{ oldPassword:string, newPassword: string, confirmNewPassword: string}>){
    const { oldPassword, newPassword, confirmNewPassword } = passwords;

    this.changePasswordForm.setErrors(null);

    if (oldPassword && newPassword && oldPassword === newPassword) {
      this.changePasswordForm.get('oldPassword')?.setErrors({ OldNewSame: true });
    } else if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      this.changePasswordForm.get('newPasswordAgain')?.setErrors({ newPasswordDoesntMatch: true });
    }

  }


  checkUsernameValidity(value: string) {
    const control = this.changeUsernameForm.get('newUsername');
    if (this.invalidUsernames.has(value.trim())) {
      control?.setErrors({ usernameTaken: true });
    } else {
      control?.setErrors(null);
    }
  }

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
}
