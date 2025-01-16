import {Component, inject} from '@angular/core';
import {FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {Toast} from 'primeng/toast';

export interface FormSendEmail {
  email: FormControl<string>;
}

@Component({
  selector: 'app-resend-verification',
  imports: [
    Button,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './resend-verification.component.html',
  styleUrl: './resend-verification.component.sass'
})
export class ResendVerificationComponent {
  private  _formBuilder = inject(NonNullableFormBuilder)
  private _authService = inject(AuthService);
  private _messageService = inject(MessageService);

  form = this._formBuilder.group<FormSendEmail>({
    email: this._formBuilder.control('', [Validators.required,Validators.email]),
  })


  async submit(){
    if (this.form.invalid) {
      this.showToast('error','Form Error','Please fill out all fields correctly.')
      return;
    }

    const { email } = this.form.value;

    if (!email) {
      this.showToast('error', 'Validation Error', 'Email cannot be empty.');
      return;
    }

    try {
      const response = this._authService.resendVerificationEmail(email);
      response.subscribe({
        next: () => {
          this.showToast('success', 'Success', 'Verification email has been sent successfully.');
        },
        error: (err) => {
          console.error('Error sending email:', err);
          this.showToast('error', 'Error', 'Failed to send verification email. Please try again later.');
        },
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      this.showToast('error', 'Error', 'An unexpected error occurred. Please try again.');
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
