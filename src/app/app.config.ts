/* =====================================================================
   FILE: src/app/app.config.ts
   WHAT: Registers the "global tools" the whole app can use.
   ===================================================================== */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // STEP 1: Turn on routing (which URL shows which page).
    provideRouter(routes),
    // STEP 2: Turn on HttpClient. Our StudentService needs it to read
    // the fake API now and talk to Laravel later.
    // COMMON MISTAKE: skipping this line gives "No provider for HttpClient".
    provideHttpClient(),

    provideClientHydration(),
  ],
};
