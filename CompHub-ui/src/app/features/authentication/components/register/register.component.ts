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
import { FloatLabel } from 'primeng/floatlabel';
import {ToastService} from '../../../../core/services/Toast/toast.service';
import { isTouchedAndHasError } from '../../../../shared/utils/form-utils';

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
    FloatLabel
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

  form = this.formBuilder.group<FormSignIn>({
    username: this.formBuilder.control('', Validators.required),
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.formBuilder.control('', Validators.required),
  });

  invalidInputs = {
    usernames: new Set<string>(),
    emails: new Set<string>(),
  };

  async submitForm() {
    if (this.form.invalid) {
      this.toastService.showErrorToast('Form Error','Please fill out all fields correctly.')
      return;
    }

    const { username, email, password } = this.form.value;

    if (!username || !password || !email) {
      return;
    }

    if (this.invalidInputs.usernames.has(username)) {
      this.toastService.showErrorToast('Validation Error',`The username "${username}" is already taken.`)
      return;
    }

    if (this.invalidInputs.emails.has(email)) {
      this.toastService.showErrorToast('Validation Error',`The email "${email}" is already associated with an account.`)
      return;
    }


      const response = this.authService.register({username, email, password});

      response.subscribe({
        next: async () => {
          await this.router.navigate(['email-sent'],{relativeTo: this.route, skipLocationChange: true});
        },
        error: (httpError: any) => {
          //  409 -> Conflict
          if (httpError.status == 409){
            if (httpError.error.message.includes('Username') && httpError.error.message.includes('taken')) this.invalidInputs.usernames.add(username);
            if (httpError.error.message.includes('Email') && httpError.error.message.includes('associated')) this.invalidInputs.emails.add(email);
          }
          console.error(httpError)
          if(httpError.status != 0){
            this.toastService.showErrorToast('Error', httpError.error.message);
          }
        }
      });

  }

  isTouchedAndHasError(field: string, error:string){
    return isTouchedAndHasError(field,this.form,error);
  }
}
