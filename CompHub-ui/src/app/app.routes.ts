import {NotFoundComponent} from './pages/not-found/not-found.component';
import {Routes} from '@angular/router';
import {MainLayoutComponent} from './layout/main-layout/main-layout.component';
import {authRotes} from './features/authentication/auth.routes';
import {userRoutes} from './features/user/user.routes';
import {alreadyAuthenticatedGuard} from './core/guards/AlreadyAuthenticated/already-authenticated.guard';
import {componentRoutes} from './features/frontend-component/component.routes';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivateChild:[alreadyAuthenticatedGuard],
    children: authRotes
  },
  {
    path: 'profile',
    children: userRoutes
  },
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: componentRoutes
  },
  {
    path: 'notFound',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'notFound'
  }
];
