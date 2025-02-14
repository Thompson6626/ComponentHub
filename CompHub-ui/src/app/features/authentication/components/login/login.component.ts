import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {AuthService} from '../../services/Auth/auth.service';
import {Router, RouterLink} from '@angular/router';

import {FloatLabel} from 'primeng/floatlabel';
import {ToastService} from '../../../../core/services/Toast/toast.service';
import { isTouchedAndIsRequired } from '../../../../shared/utils/form-utils';
import {AuthStateService} from '../../../../core/services/AuthState/auth-state.service';



export interface FormLogIn {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [
    Button,
    FormsModule,
    InputText,
    Password,
    ReactiveFormsModule,
    FloatLabel,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent{

  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  form = this.formBuilder.group<FormLogIn>({
    username: this.formBuilder.control('', Validators.required),
    password: this.formBuilder.control('', Validators.required),
  });

  async submitForm() {
    if (this.form.invalid) {
      this.toastService.showErrorToast('Form Error', 'Please fill out all fields correctly.');
      return;
    }

    const { username, password } = this.form.value;

    if (!username || !password) return;

    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.router.navigate(['/search']);
      },
      error: (err) => {
        this.toastService.showErrorToast('Error', 'Failed to log in');
      }
    });
  }

  isTouchedAndIsRequired(field: string){
    return isTouchedAndIsRequired(field,this.form);
  }

}
