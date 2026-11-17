import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Student } from '../../models/student.model';
import { AuthService, User } from '../../services/auth.service';
import { StoryDraftService } from '../../services/story-draft.service';
import { StudentService } from '../../services/student.service';
import { ProfilePage } from './profile-page';

describe('ProfilePage (unit)', () => {
  let fixture: ComponentFixture<ProfilePage>;
  let el: HTMLElement;

  const maya: Student = {
    id: 1,
    name: 'Maya Hassan',
    faculty: 'Engineering',
    classYear: 2028,
    quote: 'Build things that make a difference.',
    photo: 'maya.jpg',
    featured: true,
  };

  const auth = {
    currentUser: signal<User | null>({ studentId: 1, name: 'Maya Hassan' }),
    logout: vi.fn(),
  };
  const students = { getStudents: vi.fn() };
  const drafts = { load: vi.fn(), save: vi.fn(), clear: vi.fn() };

  function type(selector: string, text: string): void {
    const input = el.querySelector(selector) as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(() => {
    auth.currentUser.set({ studentId: 1, name: 'Maya Hassan' });
    auth.logout.mockReset();
    drafts.clear.mockReset();
    students.getStudents.mockReset();
    students.getStudents.mockReturnValue(of([maya]));
    drafts.load.mockReset();
    drafts.load.mockReturnValue(null);
    drafts.save.mockReset();
    drafts.save.mockReturnValue('2026-11-12T14:32:05.000Z');

    TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: StudentService, useValue: students },
        { provide: StoryDraftService, useValue: drafts },
      ],
    });
  });

  async function render(): Promise<void> {
    fixture = TestBed.createComponent(ProfilePage);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  it('loads the signed-in student and fills the quote from the directory', async () => {
    await render();
    expect((el.querySelector('#quote') as HTMLInputElement).value).toBe(maya.quote);
    expect(el.querySelector('.actions__status')?.textContent).toContain('No changes yet');
  });

  it('restores a saved draft instead of the directory quote', async () => {
    drafts.load.mockReturnValue({
      savedAt: '2026-11-12T14:32:05.000Z',
      values: { quote: 'My draft quote', story: '', moment: '', next: '', consent: false },
    });
    await render();

    expect((el.querySelector('#quote') as HTMLInputElement).value).toBe('My draft quote');
    expect(drafts.load).toHaveBeenCalledWith(1);
    expect(el.querySelector('.mini__quote')?.textContent).toContain('My draft quote');
    expect(el.querySelector('.actions__status')?.textContent).toContain('Draft saved');
    expect(fixture.componentInstance.hasUnsavedChanges()).toBe(false);
  });

  it('tracks typing and asks the draft service to save what was typed', async () => {
    await render();
    type('#quote', 'A new quote');
    await fixture.whenStable();
    expect(el.querySelector('.actions__status')?.textContent).toContain('Unsaved changes');
    expect(el.querySelector('.mini__quote')?.textContent).toContain('A new quote');

    (el.querySelector('.actions__buttons .btn') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(drafts.save).toHaveBeenCalledWith(1, expect.objectContaining({ quote: 'A new quote' }));
    expect(el.querySelector('.actions__status')?.textContent).toContain('Draft saved');
  });

  it('says Could not save when the draft service returns null', async () => {
    drafts.save.mockReturnValue(null);
    await render();

    (el.querySelector('.actions__buttons .btn') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(el.querySelector('.actions__status')?.textContent).toContain('Could not save');
  });

  it('keeps unsaved edits when storage refuses a save', async () => {
    drafts.save.mockReturnValue(null);
    await render();
    type('#story', 'A memory worth keeping');
    await fixture.whenStable();
    (el.querySelector('.actions__buttons .btn') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.hasUnsavedChanges()).toBe(true);
    expect((el.querySelector('#story') as HTMLTextAreaElement).value).toBe(
      'A memory worth keeping',
    );
  });
});
