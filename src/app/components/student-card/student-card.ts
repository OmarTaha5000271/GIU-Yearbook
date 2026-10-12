/* =====================================================================
   FILE: components/student-card/student-card.ts
   WHAT: The logic for displaying one student in the yearbook.
   WHY: The page gives this component a student, and the card handles its
        own portrait, including a fallback when the image cannot load.
   ===================================================================== */

import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-card',
  imports: [RouterLink],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css',
})
export class StudentCard {
  // Every card needs a student from the page that displays it.
  readonly student = input.required<Student>();

  // Keep track of whether the student's portrait failed to load.
  private readonly imageFailed = signal(false);

  // If the photo is missing, show the placeholder instead.
  protected readonly photoSrc = computed(() =>
    this.imageFailed() ? 'images/placeholder-portrait.svg' : this.student().photo,
  );

  // The image element calls this when its file cannot be loaded.
  protected onImageError(): void {
    this.imageFailed.set(true);
  }
}
