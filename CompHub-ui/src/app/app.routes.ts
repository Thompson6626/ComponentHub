import {NotFoundComponent} from './pages/not-found/not-found.component';
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    //component: AppComponent,
    children: [
      {
        //canActivateChild: [publicGuard],
        path: 'auth',
        loadChildren: () => import('./features/authentication/auth.routes')
      },
    ]
  },
  {
    path: 'notFound',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'notFound'
  }
];
