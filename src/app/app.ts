/* =====================================================================
   FILE: src/app/app.ts   (the ROOT component)
   WHAT: The outer "shell" every page lives inside: header on top,
         page content in the middle.
   ===================================================================== */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { TopStrip } from './components/top-strip/top-strip';

@Component({
  selector: 'app-root',
  // STEP 1: A standalone component must LIST every component, directive
  // or pipe it uses in its template. Forgetting one gives the error
  // "'app-header' is not a known element".
  imports: [RouterOutlet, Header, TopStrip],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
