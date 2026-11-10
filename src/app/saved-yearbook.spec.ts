import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { App } from './app';
import { routes } from './app.routes';
import { StudentService } from './services/student.service';
import { SavedService } from './services/saved.service';
import { Student } from './models/student.model';

describe('Saved yearbook', () => {
  it('keeps hearts and header synchronized through toggles and navigation', async () => {
    const students: Student[] = [1, 2, 3].map(id => ({
      id, name: `Student ${id}`, faculty: 'Engineering', classYear: 2028,
      quote: 'Hello', photo: 'images/placeholder-portrait.svg', featured: false,
    }));
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
        { provide: StudentService, useValue: { getStudents: () => of(students) } }],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const hearts = () => Array.from(root.querySelectorAll<HTMLButtonElement>('.card__save'));
    const count = () => root.querySelector('.header__count')?.textContent?.trim();
    expect(count()).toBe('0');
    for (const heart of hearts()) heart.click();
    await fixture.whenStable();
    expect(router.url).toBe('/');
    expect(count()).toBe('3');
    expect(hearts().every(heart => heart.getAttribute('aria-pressed') === 'true')).toBe(true);
    hearts()[0].click();
    await fixture.whenStable();
    expect(count()).toBe('2');
    expect(hearts()[0].getAttribute('aria-pressed')).toBe('false');
    root.querySelector<HTMLAnchorElement>('a.card')!.click();
    await fixture.whenStable();
    expect(router.url).toBe('/students/1');
    expect(count()).toBe('2');
    await router.navigateByUrl('/');
    await fixture.whenStable();
    expect(hearts().filter(heart => heart.classList.contains('card__save--on')).length).toBe(2);
    expect(count()).toBe('2');
    fixture.destroy();
    TestBed.resetTestingModule();
    // A fresh application injector, like a reload, has no saved selections.
    expect(TestBed.inject(SavedService).count()).toBe(0);
  });
});
