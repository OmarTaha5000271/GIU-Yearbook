/* =====================================================================
   FILE: src/app/app.routes.ts
   WHAT: The map between URLs and pages.
   WHY:  A single-page app never reloads. The router swaps the page
         inside <router-outlet> (see app.html) when the URL changes.
   ===================================================================== */
import { Routes } from '@angular/router';

import { StudentsPage } from './pages/students-page/students-page';
import { PlaceholderPage } from './pages/placeholder-page/placeholder-page';

export const routes: Routes = [
  // STEP 1: The landing page. An empty path '' means "the home URL".
  { path: '', component: StudentsPage, title: 'Class of 2028 · GIU Yearbook' },

  // STEP 2: Pages we have NOT designed/built yet use one placeholder page.
  // `data` lets us pass a small piece of information (the title) to it.
  // TIP: When you build the real page, replace `PlaceholderPage` with it.
  { path: 'teachers', component: PlaceholderPage, data: { title: 'Teachers & Staff' } },
  { path: 'gallery', component: PlaceholderPage, data: { title: 'Gallery' } },
  { path: 'login', component: PlaceholderPage, data: { title: 'Student login' } },

  // STEP 3: `:id` is a route PARAMETER. /students/3 and /students/7 both
  // match this route. The page can read the number later.
  { path: 'students/:id', component: PlaceholderPage, data: { title: 'Student story' } },

  // STEP 4: Wildcard. Any unknown URL goes back to the home page.
  // COMMON MISTAKE: this MUST be last. Routes are matched top to bottom.
  { path: '**', redirectTo: '' },
];
