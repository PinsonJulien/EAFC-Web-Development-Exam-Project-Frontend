import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-course',
  templateUrl: 'course.page.html',
  styleUrls: ['course.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  providers: []
})
export class CoursePage implements OnInit
{
  constructor(
  ) {
    //
  }

  public ngOnInit(): void
  {
    //
  }
}
