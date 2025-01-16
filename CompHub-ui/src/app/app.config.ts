import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';

import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
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
          authInterceptor
      ])
    ),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({}),
    ]
};
