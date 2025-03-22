import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/Auth/auth.service';
import {Router, RouterLink} from '@angular/router';

import {ToastService} from '../../../../core/services/Toast/toast.service';
import {FormInputComponent} from '../../../../shared/components/form-input/form-input.component';
import {AuthWrapperComponent} from '../auth-wrapper/auth-wrapper.component';



export interface FormLogIn {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [
    Button,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    FormInputComponent,
    AuthWrapperComponent
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

  getControl(name: string){
    return this.form.get(name)! as FormControl<string>;
  }
}
