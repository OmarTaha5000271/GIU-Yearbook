import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentsPage } from './students-page';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { StudentService } from '../../services/student.service';

describe('StudentsPage', () => {
  let component: StudentsPage;
  let fixture: ComponentFixture<StudentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsPage],
      providers: [provideRouter([]),
        { provide: StudentService, useValue: { getStudents: () => of([]) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
