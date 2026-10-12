/* =====================================================================
   FILE: pages/placeholder-page/placeholder-page.ts
   WHAT: A temporary page for screens we haven't built yet
         (Teachers, Gallery, Login, Student story).
   WHY:  The navigation works from day one, and students SEE routing
         working before every page exists.
   ===================================================================== */
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  imports: [RouterLink],
  template: `
    <section class="placeholder">
      <p class="overline">COMING SOON</p>
      <h1>{{ title }}</h1>
      <p>This page is an exercise for a later lesson.</p>
      <a class="btn" routerLink="/">Back to the directory</a>
    </section>
  `,
  styles: `
    .placeholder { padding: var(--space-9) 0; display: grid; gap: var(--space-4); justify-items: start; }
    .overline { font-size: 11px; letter-spacing: 0.08em; color: var(--color-red); }
    h1 { font: 400 40px/1.15 var(--font-serif); }
    p { color: var(--color-muted); }
  `,
})
export class PlaceholderPage {
  // ActivatedRoute describes the route currently showing this page.
  private readonly route = inject(ActivatedRoute);

  // The title comes from the `data` we set in app.routes.ts.
  protected readonly title: string = this.route.snapshot.data['title'];
}
