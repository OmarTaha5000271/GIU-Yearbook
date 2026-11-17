import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Student } from '../models/student.model';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let http: HttpTestingController;

  const fakeStudents: Student[] = [
    {
      id: 1,
      name: 'Maya Hassan',
      faculty: 'Engineering',
      classYear: 2028,
      quote: 'Build things.',
      photo: 'maya.jpg',
      featured: true,
    },
    {
      id: 2,
      name: 'Adam Schneider',
      faculty: 'Informatics',
      classYear: 2028,
      quote: 'Curiosity first.',
      photo: 'adam.jpg',
      featured: false,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StudentService);
    http = TestBed.inject(HttpTestingController);
    vi.useFakeTimers();
  });

  afterEach(() => {
    try {
      http.verify();
    } finally {
      vi.useRealTimers();
    }
  });

  it('GETs the students file and returns what the server sent', async () => {
    const result = firstValueFrom(service.getStudents());

    const req = http.expectOne('mock-api/students.json');
    expect(req.request.method).toBe('GET');

    req.flush(fakeStudents);
    await vi.advanceTimersByTimeAsync(400);
    expect(await result).toEqual(fakeStudents);
  });

  it('passes a server error on to the caller', async () => {
    let failure: unknown;
    service.getStudents().subscribe({ error: (err) => (failure = err) });

    http
      .expectOne('mock-api/students.json')
      .flush('Boom', { status: 500, statusText: 'Server Error' });
    await vi.advanceTimersByTimeAsync(400);

    expect((failure as { status: number }).status).toBe(500);
  });

  it('waits the full 400 ms before delivering the students', async () => {
    const received = vi.fn();
    service.getStudents().subscribe(received);
    http.expectOne('mock-api/students.json').flush(fakeStudents);
    await vi.advanceTimersByTimeAsync(399);
    expect(received).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(received).toHaveBeenCalledExactlyOnceWith(fakeStudents);
  });
});
