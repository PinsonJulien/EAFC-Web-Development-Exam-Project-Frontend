import { ChangeDetectionStrategy, Component } from '@angular/core';
import CourseService from 'src/app/core/services/CourseService';
import CsrfService from 'src/app/core/services/CsrfService';
import { AuthService } from 'src/app/shared/data-access/auth/auth.service';
import Cookie from 'src/helpers/cookie';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  constructor(
    private courseService: CourseService,
    private csrfService: CsrfService,
    private authService: AuthService
  ) {

    this.authService.logout();



    this.courseService.getAll().subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (error) => {
        console.error(error)
      }
    });

    this.csrfService.getToken().subscribe({
      next: (data) => {

        this.csrfService.test().subscribe(
          response => {
            console.log(response)
          }

          /*{
          next: (data) => {
            console.log(data)
          },
          error: (error) => {
            console.log("lol err")
            console.error(error)
          }
        }*/);


      },
      error: (error) => {
        console.error(error.headers)
      }
    });

    /*
      courses => {
      },
      error => {
        console.error(error)
      }
    );
      */

  }
}
