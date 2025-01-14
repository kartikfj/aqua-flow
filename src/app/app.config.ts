import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { createReducer, provideState, provideStore } from '@ngrx/store';
import { projectReducer } from './state/reducer';
import { provideEffects } from '@ngrx/effects';
import { ProjectEffects } from './state/projectEffects';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideHttpClient(),
    provideStore({ projects: projectReducer }), // Register the reducer
    provideEffects([ProjectEffects]), // Register the effects
  ]
};
