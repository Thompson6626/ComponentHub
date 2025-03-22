import {Component, inject} from '@angular/core';
import {
  FormControl, NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {ActivatedRoute, Router} from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/Auth/auth.service';
import { Button } from 'primeng/button';
import {ToastService} from '../../../../core/services/Toast/toast.service';
import {FormInputComponent} from '../../../../shared/components/form-input/form-input.component';
import {AuthWrapperComponent} from '../auth-wrapper/auth-wrapper.component';
import {UniqueUsernameValidator} from '../../../../shared/validators/unique-username';
import {UniqueEmailValidator} from '../../../../shared/validators/unique-email';

export interface FormSignIn {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    Button,
    FormInputComponent,
    AuthWrapperComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.sass'
})
export class RegisterComponent{

  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router)
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private uniqueUsernameValidator = inject(UniqueUsernameValidator);
  private uniqueEmailValidator  = inject(UniqueEmailValidator);

  form = this.formBuilder.group<FormSignIn>({
    username: this.formBuilder.control(
      '',
      Validators.required,
      this.uniqueUsernameValidator.validate.bind(this.uniqueUsernameValidator)
    ),
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ],
      this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)
    ),
    password: this.formBuilder.control('', Validators.required),
  });

  async submitForm() {
    if (this.form.invalid) {
      this.toastService.showErrorToast('Form Error','Please fill out all fields correctly.')
      return;
    }

    const { username, email, password } = this.form.value;

    if (!username || !password || !email) {
      return;
    }

      const response = this.authService.register({username, email, password});

      response.subscribe({
        next: async () => {
          await this.router.navigate(['email-sent'],{relativeTo: this.route, skipLocationChange: true});
        },
        error: (httpError: any) => {
          if(httpError.status != 0){
            this.toastService.showErrorToast('Error', httpError.error.message);
          }
        }
      });
  }

  getControl(name: string){
    return this.form.get(name)! as FormControl<string>;
  }


}
