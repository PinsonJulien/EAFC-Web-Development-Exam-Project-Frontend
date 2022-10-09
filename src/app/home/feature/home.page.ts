import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from 'src/app/shared/data-access/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  constructor(
    private authService: AuthService
  ) {
    /*authService.register('test3', 'test@test.com', 'TestTestTest', 'TestTestTest').subscribe((e) => {
      console.log(e);
      authService.login('test2@test.com', 'TestTestTest')
      .subscribe((e) => {
        console.log(e)
      authService.user().subscribe((e) => {
        console.log(e)
      })
    })
    } )*/
  }
}
