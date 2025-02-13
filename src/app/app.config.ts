import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';
import { createReducer, provideState, provideStore } from '@ngrx/store';
import { projectReducer } from './state/reducer';
import { provideEffects } from '@ngrx/effects';
import { ProjectEffects } from './state/projectEffects';
import { LoaderInterceptorService } from './loader-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideHttpClient(),
    provideStore({ projects: projectReducer }), // Register the reducer
    provideEffects([ProjectEffects]), // Register the effects
  ]
};
