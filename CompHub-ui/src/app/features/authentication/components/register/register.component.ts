import {Component, inject} from '@angular/core';
import {
  FormControl, NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {ActivatedRoute, Router} from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { isRequired,hasEmailError } from '../../utils/validators';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';

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
    Toast,
    Button,
    FloatLabel
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.sass'
})
export class RegisterComponent {

  private _formBuilder = inject(NonNullableFormBuilder);
  private _authService = inject(AuthService)
  private _messageService = inject(MessageService);
  private _router = inject(Router)
  private _route = inject(ActivatedRoute);

  form = this._formBuilder.group<FormSignIn>({
    username: this._formBuilder.control('', Validators.required),
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', Validators.required),
  });

  invalidInputs = {
    usernames: new Set<string>(),
    emails: new Set<string>(),
  };


  isRequired(field:'username' | 'email' | 'password') {
    return isRequired(field, this.form);
  }
  hasEmailError(){
    return hasEmailError(this.form);
  }

  async submit() {
    if (this.form.invalid) {
      this.showToast('error','Form Error','Please fill out all fields correctly.')
      return;
    }

    const { username, email, password } = this.form.value;

    // Optionally check for empty fields (though the form should handle this)
    if (!username || !password || !email) {
      return;
    }

    if (this.invalidInputs.usernames.has(username)) {
      this.showToast('error','Validation Error',`The username "${username}" is already taken.`)
      return;
    }

    if (this.invalidInputs.emails.has(email)) {
      this.showToast('error','Validation Error',`The email "${email}" is already associated with an account.`)
      return;
    }


      const response = this._authService.register({username, email, password});

      response.subscribe({
        next: async (response) => {
          await this._router.navigate(['/email-sent'],{relativeTo: this._route, skipLocationChange: true});
        },
        error: (httpError: any) => {
          if (httpError.status == 409){
            if (httpError.error.message.includes('Username') && httpError.error.message.includes('taken')) this.invalidInputs.usernames.add(username);
            if (httpError.error.message.includes('Email') && httpError.error.message.includes('associated')) this.invalidInputs.emails.add(email);
          }
          this.showToast('error', 'Error', httpError.error.message);
        }
      });

  }

  showToast(_severity:string,_summary:string,_detail:string){
    this._messageService.add({
      severity: _severity,
      summary: _summary,
      detail: _detail,
    })
  }





}
