/* =====================================================================
   FILE: src/app/services/student.service.ts
   WHAT: The ONLY place in the app that knows where student data
         comes from.
   WHY:  Components just ask for students. They don't care whether the
         answer comes from a JSON file today or from Laravel tomorrow.
         When the backend is ready, you change THIS file and no
         component needs to change.  (This idea is called
         "separation of concerns".)
   ===================================================================== */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay } from 'rxjs';

import { environment } from '../../environments/environment';
import { Student } from '../models/student.model';

// STEP 1: @Injectable({ providedIn: 'root' }) creates ONE shared copy of
// this service for the whole app. Any component can then ask for it.
@Injectable({ providedIn: 'root' })
export class StudentService {
  // STEP 2: inject() gives us Angular's HTTP client.
  // COMMON MISTAKE: forgetting provideHttpClient() in app.config.ts
  // gives the error "No provider for HttpClient".
  private http = inject(HttpClient);

  // STEP 3: Return an Observable<Student[]>.
  // An Observable is a promise of data that will arrive LATER. Nothing is
  // requested until someone calls .subscribe() on it.
  getStudents(): Observable<Student[]> {
    if (environment.useMockApi) {
      // FAKE API: read the JSON file from /public/mock-api.
      // delay(400) waits 400ms so students can SEE the loading state,
      // just like a real network request would take time.
      return this.http
        .get<Student[]>('mock-api/students.json')
        .pipe(delay(400));
    }

    // REAL API (backend phase): same return type, different URL.
    // Laravel will expose this with:  Route::get('/students', ...)
    return this.http.get<Student[]>(`${environment.apiUrl}/students`);
  }
}
