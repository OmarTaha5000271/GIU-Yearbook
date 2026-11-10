import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, map } from 'rxjs';
import { Student } from '../../models/student.model';
import { AuthService } from '../../services/auth.service';
import { StoryDraftService } from '../../services/story-draft.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly students = inject(StudentService);
  private readonly drafts = inject(StoryDraftService);

  protected readonly form = this.fb.group({
    quote: ['', [Validators.required, Validators.maxLength(160)]],
    story: ['', Validators.maxLength(1000)],
    moment: ['', Validators.maxLength(200)],
    next: ['', Validators.maxLength(120)],
    consent: [false],
  });
  protected readonly values = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );
  protected readonly student = signal<Student | null>(null);
  protected readonly user = this.auth.currentUser;
  protected readonly changed = signal(false);
  protected readonly savedAt = signal<string | null>(null);
  protected readonly storageError = signal(false);
  protected readonly loadError = signal('');
  protected readonly signOutError = signal('');
  protected readonly signingOut = signal(false);
  protected readonly quoteLength = computed(() => this.values().quote.length);

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.changed.set(true);
      this.storageError.set(false);
    });
  }

  ngOnInit(): void {
    const studentId = this.auth.currentUser()!.studentId;
    this.students.getStudents().subscribe({
      next: (list) => {
        const student = list.find((item) => item.id === studentId);
        if (!student) {
          this.loadError.set('Your student profile could not be found. Please contact the yearbook team.');
          return;
        }
        this.student.set(student);
        const draft = this.drafts.load(student.id);
        if (draft) {
          this.form.patchValue(draft.values);
          this.savedAt.set(draft.savedAt);
        } else {
          this.form.patchValue({ quote: student.quote });
        }
        this.changed.set(false);
      },
      error: () => this.loadError.set('Could not load your profile. Please refresh to try again.'),
    });
  }

  protected saveDraft(): void {
    const student = this.student();
    if (!student) return;
    // A draft may be incomplete: saving must not require a valid form.
    const time = this.drafts.save(student.id, this.form.getRawValue());
    this.storageError.set(time === null);
    if (time) {
      this.savedAt.set(time);
      this.changed.set(false);
    }
  }

  hasUnsavedChanges(): boolean { return this.changed(); }

  @HostListener('window:beforeunload', ['$event'])
  protected warnBeforeClosing(event: BeforeUnloadEvent): void {
    if (this.changed()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  protected signOut(): void {
    if (this.signingOut()) return;
    if (this.changed() && !window.confirm('Sign out without saving your latest changes?')) return;
    this.signOutError.set('');
    this.signingOut.set(true);
    this.auth.logout().pipe(finalize(() => this.signingOut.set(false))).subscribe({
      next: () => {
        this.changed.set(false);
        void this.router.navigateByUrl('/');
      },
      error: () => this.signOutError.set('Could not sign out. Please try again.'),
    });
  }
}
