import { ChangeDetectionStrategy, Component } from '@angular/core';
import CourseApiService from 'src/app/core/services/api/course-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  constructor(
    private courseService: CourseApiService,
  ) {

    this.courseService.getAll().subscribe({
      next: (data: any) => {
        console.log(data)
      },
      error: (error: any) => {
        console.error(error)
      }
    });
  }
}
