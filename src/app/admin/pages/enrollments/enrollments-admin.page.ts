import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import Enrollment from "src/app/core/models/Enrollment";
import Status from "src/app/core/models/Status";
import EnrollmentStoreService from "src/app/core/services/store/enrollment-store.service";
import StatusStoreService from "src/app/core/services/store/status-store.service";

@Component({
  standalone: true,
  selector: 'app-admin-enrollments',
  templateUrl: 'enrollments-admin.page.html',
  styleUrls: ['enrollments-admin.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ],
  providers: [
    //
  ],
})
export class EnrollmentsAdminPage implements OnInit
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  protected statuses!: Observable<Status[]|null>;

  protected enrollments!: Observable<Enrollment[]|null>;

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    protected enrollmentStoreService: EnrollmentStoreService,
    protected statusStoreService: StatusStoreService,
  ) {
    //
  }

  /************************************************************/
  //
  // Implemented Methods
  //
  /************************************************************/

  public ngOnInit(): void {
    // Create references to the stores observables.
    this.statuses = this.statusStoreService.statuses$;
    this.enrollments = this.enrollmentStoreService.enrollments$;

    // Refresh data, if necessary.
    this.enrollmentStoreService.refreshEnrollments();

    if (!this.statusStoreService.statuses)
      this.statusStoreService.refreshStatuses();
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  //


}
