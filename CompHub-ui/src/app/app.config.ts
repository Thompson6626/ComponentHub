import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';

import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/interceptors/Auth/auth.interceptor';
import Nora from '@primeng/themes/nora';
import {MessageService} from 'primeng/api';
import {networkErrorInterceptor} from './core/interceptors/NetworkError/network-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling:'enabled', scrollPositionRestoration:'enabled'
      })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
          authInterceptor,
          networkErrorInterceptor
      ])
    ),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Nora,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    }),
    ]
};
