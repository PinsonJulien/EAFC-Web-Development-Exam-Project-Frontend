import { ChangeDetectionStrategy, Component } from '@angular/core';
import CourseService from 'src/app/core/services/course.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  constructor(
    private courseService: CourseService,
  ) {

    this.courseService.getAll().subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (error) => {
        console.error(error)
      }
    });
  }
}
