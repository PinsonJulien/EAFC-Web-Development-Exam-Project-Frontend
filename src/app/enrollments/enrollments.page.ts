import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import EnrollmentStoreService from "../core/services/store/enrollment-store.service";
import { ApiError } from "../core/types/api/api-error";

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
    MatSnackBarModule,
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
    protected enrollmentStoreService: EnrollmentStoreService,
    protected snackBar: MatSnackBar,
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
    // Listen to enrollment errors and throw them in the snackBar.
    this.enrollmentStoreService.error$.subscribe((error: ApiError | null) => {
      if (!error) return;

      this.snackBar.open(error.message, 'close');
    });
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  //
}
