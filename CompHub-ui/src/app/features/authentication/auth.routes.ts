import { Routes } from '@angular/router';

export default [
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'verify',
    loadComponent: () => import('./components/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
  },
  {
    path: 'resend-verification',
    loadComponent: () => import('./components/resend-verification/resend-verification.component').then(m => m.ResendVerificationComponent)
  },
  {
    path: 'email-sent',
    loadComponent: () => import('./components/email-sent/email-sent.component').then(m => m.EmailSentComponent)
  },
  {
    path: '**',
    redirectTo: 'notFound'
  }
] as Routes;
