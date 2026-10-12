/* =====================================================================
   FILE: src/app/app.routes.server.ts
   WHAT: Defines the server-side rendering mode for application routes.
   WHY: Student story URLs are dynamic, so they must be rendered at request time.
   ===================================================================== */
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'students/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  }
];
