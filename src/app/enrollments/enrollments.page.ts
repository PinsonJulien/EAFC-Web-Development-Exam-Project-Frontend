import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-enrollments',
  templateUrl: 'enrollments.page.html',
  styleUrls: ['enrollments.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
  ],
  providers: [
    //
  ],
})
export class EnrollmentsPage implements OnInit
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  protected subPages = [
    {
      name: 'Available',
      path: 'available'
    },
    {
      name: 'History',
      path: 'history'
    }
  ];

  protected activeSubPage = this.subPages[0];

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
