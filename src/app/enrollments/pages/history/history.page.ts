import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  standalone: true,
  selector: 'app-enrollments-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ],
  providers: [
    //
  ],
})
export class HistoryEnrollmentsPage implements OnInit
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  //

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    //
  ) {
    //
  }

  /************************************************************/
  //
  // Implemented Methods
  //
  /************************************************************/

  public ngOnInit(): void
  {
    //
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  //
}
