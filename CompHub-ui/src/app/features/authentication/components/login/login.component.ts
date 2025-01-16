import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Toast} from 'primeng/toast';
import { isRequired,hasEmailError } from '../../utils/validators';
import {AuthService} from '../../services/auth.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

import {FloatLabel} from 'primeng/floatlabel';



export interface FormLogIn {
  email: FormControl<string>;
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
    Toast,
    FloatLabel
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {

  private _formBuilder = inject(NonNullableFormBuilder);
  private _authService = inject(AuthService)
  private _messageService = inject(MessageService);
  private _router = inject(Router)


  form = this._formBuilder.group<FormLogIn>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', Validators.required),
  });

  isRequired(field:'email' | 'password') {
    return isRequired(field, this.form);
  }

  async submit(){
    if (this.form.invalid) {
      this.showToast('error','Form Error','Please fill out all fields correctly.')
      return;
    }
    try {
      const {email,password} = this.form.value;

      if (!password || !email) return;

      this._authService.logIn({email, password});

      await this._router.navigate(['/components']);
    }catch (error) {
      this.showToast('error','Error','Failed to log in')
    }

  }


  showToast(_severity:string,_summary:string,_detail:string){
    this._messageService.add({
      severity: _severity,
      summary: _summary,
      detail: _detail,
    })
  }

}
