import { Routes } from '@angular/router';
import {ComponentListComponent} from './components/component-management/component-list/component-list.component';
import {ComponentShowcaseComponent} from './components/component-management/component-showcase/component-showcase.component';
import {ComponentCreationComponent} from './components/component-management/component-creation/component-creation.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {authGuard} from '../../core/guards/Authentication/auth.guard';

export const componentRoutes: Routes = [
  {
    path: 'search',
    component: ComponentListComponent
  },
  {
    path: 'user/:username/component/:componentName',
    component: ComponentShowcaseComponent
  },
  {
    path: 'user/:username',
    component: UserProfileComponent
  },
  {
    path: 'create',
    canActivate: [authGuard],
    component: ComponentCreationComponent
  },
  { path: '**', redirectTo: '/notFound' }
];
