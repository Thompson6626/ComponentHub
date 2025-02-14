import { Routes } from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';

export const authRotes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'verify',
    component: VerifyEmailComponent
  },
  {
    path: 'resend-verification',
    loadComponent: () => import('./components/resend-verification/resend-verification.component').then(m => m.ResendVerificationComponent)
  },
  {
    path: 'email-sent',
    loadComponent:() => import('./components/email-sent/email-sent.component').then(m => m.EmailSentComponent)
  },
  { path: '**', redirectTo: '/notFound' }
];
