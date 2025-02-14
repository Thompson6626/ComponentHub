import { Routes } from '@angular/router';
import {authGuard} from '../../core/guards/Authentication/auth.guard';
import {SettingsComponent} from './components/settings/settings.component';

export const userRoutes: Routes = [
  {
    path: 'settings',
    canActivate: [authGuard],
    component: SettingsComponent
  },
  { path: '**', redirectTo: '/notFound' }
];
