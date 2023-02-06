import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { combineLatest, first, map, Observable, skip, startWith } from "rxjs";
import Enrollment from "src/app/core/models/Enrollment";
import Status from "src/app/core/models/Status";
import AuthStoreService from "src/app/core/services/store/auth-store.service";
import EnrollmentStoreService from "src/app/core/services/store/enrollment-store.service";
import StatusStoreService from "src/app/core/services/store/status-store.service";
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";


@Component({
  standalone: true,
  selector: 'app-enrollments-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
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

  protected statuses!: Observable<Status[]|null>;

  protected filteredEnrollments!: Observable<Enrollment[]|null>;

  protected selectedStatuses = new FormControl<Status[]>([]);

  protected tableColumns = ['formation-name', 'status-name', 'action'];

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    protected authStoreService: AuthStoreService,
    protected enrollmentStoreService: EnrollmentStoreService,
    protected statusStoreService: StatusStoreService,
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
    this.statuses = this.statusStoreService.statuses$;

    // Listen to the auth store to keep the enrollments up to date.
    // Automatically filter on selectedStatuses change.
    this.filteredEnrollments = combineLatest([
      this.authStoreService.user$.pipe(skip(1)),
      this.selectedStatuses.valueChanges.pipe(startWith([])),
    ]).pipe(
      map(([user, statuses]) => {
        if (!user || !user.relations?.enrollments) return [];
        statuses = statuses ?? [];

        const enrollments: Enrollment[] = user.relations.enrollments;

        return this.filterEnrollmentsByStatus(enrollments, statuses);
      })
    );

    // Refresh the user
    this.authStoreService.refreshUser();

    // Refresh the statuses.
    this.statusStoreService.refreshStatuses();
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  /**
   * Filter out all the enrollments that do not have a matching status.
   *
   * @param enrollments Enrollment[]
   * @param statuses Status[]
   * @returns Enrollment[]
   */
  protected filterEnrollmentsByStatus(enrollments: Enrollment[], statuses: Status[]): Enrollment[]
  {
    if (!enrollments.length || !statuses.length)
      return enrollments;

    // Filter all the enrollments by the given statuses.
    return enrollments.filter((enrollement: Enrollment) => {
      return statuses.some((status: Status) => {
        return status.id === enrollement.status.id;
      });
    });
  }

  /**
   * Delete the given enrollment using the store
   *
   * @param enrollment Enrollment
   * @returns void
   */
  protected deleteEnrollment(enrollment: Enrollment): void
  {
    const enrollmentId = enrollment.id;

    // Subscribe to the deleted event of the enrollment store.
    // Skip the original value and take the first one (which closes the subscription)
    this.enrollmentStoreService.deletedEnrollment$
    .pipe(skip(1), first())
    .subscribe((result: boolean) => {
      if (!result) return;

      // When a new enrollment was deleted, refresh the user.
      this.authStoreService.refreshUser();

      // Inform the user of the successul operation
      const message = `The enrollment was successfully cancelled.`;
      this.snackBar.open(message, 'close');
    });

    this.enrollmentStoreService.delete(enrollmentId);
  }
}
