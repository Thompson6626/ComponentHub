import {Component, inject} from '@angular/core';
import {FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/Auth/auth.service';
import {Button} from 'primeng/button';
import {ToastService} from '../../../../core/services/Toast/toast.service';
import {FormInputComponent} from '../../../../shared/components/form-input/form-input.component';
import {AuthWrapperComponent} from '../auth-wrapper/auth-wrapper.component';

export interface FormSendEmail {
  email: FormControl<string>;
}

@Component({
  selector: 'app-resend-verification',
  imports: [
    Button,
    ReactiveFormsModule,
    FormInputComponent,
    AuthWrapperComponent
  ],
  templateUrl: './resend-verification.component.html',
  styleUrl: './resend-verification.component.sass'
})
export class ResendVerificationComponent{

  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);

  private toasService = inject(ToastService);


  form = this.formBuilder.group<FormSendEmail>({
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email
    ]),
  })


  async submitForm(){
    if (this.form.invalid) {
      this.toasService.showErrorToast('Form Error','Please fill out all fields correctly.')
      return;
    }

    const { email } = this.form.value;

    if (!email) {
      this.toasService.showErrorToast('Validation Error', 'Email cannot be empty.');
      return;
    }

    // No try/catch needed here, error handling is done in subscribe.
    this.authService.resendVerificationEmail({ email }).subscribe({
      next: () => {
        this.toasService.showSuccessToast('Success', 'Verification email has been sent successfully.');
      },
      error: (err) => {
        console.error('Error sending email:', err);
        this.toasService.showErrorToast('Error', 'Failed to send verification email. Please try again later.');
      },
    });
  }

  getControl(name: string){
    return this.form.get(name)! as FormControl<string>;
  }
}
