import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule
  ],
  providers: [
    //
  ],
})
export class AdminPage
{
  constructor(
    //
  ) {
    //
  }
}
