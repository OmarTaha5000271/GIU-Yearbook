/* =====================================================================
   FILE: components/top-strip/top-strip.ts
   WHAT: The thin strip under the header: sample-data notice (left),
         tagline (center), small links (right).
   TIP:  This component has NO logic. That's fine! Splitting the page
         into small components keeps every file easy to read.
   ===================================================================== */
import { Component } from '@angular/core';

@Component({
  selector: 'app-top-strip',
  templateUrl: './top-strip.html',
  styleUrl: './top-strip.css',
})
export class TopStrip {}
