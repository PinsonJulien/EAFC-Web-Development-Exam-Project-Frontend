import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class AdminPage
{
  constructor(
    //
  ) {
    //
  }
}
