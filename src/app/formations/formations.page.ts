import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { combineLatest, map, Observable } from "rxjs";
import Enrollment from "../core/models/Enrollment";
import Formation from "../core/models/Formation";
import AuthStoreService from "../core/services/store/auth.store.service";
import FormationStoreService from "../core/services/store/formation.store.service";
import {MatExpansionModule} from '@angular/material/expansion';
import EnrollmentStoreService from "../core/services/store/enrollment-store.service";
import { ApiError } from "../core/types/api/api-error";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import User from "../core/models/User";
import { MatTabsModule } from "@angular/material/tabs";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import Status from "../core/models/Status";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import StatusStoreService from "../core/services/store/status-store.service";

@Component({
  standalone: true,
  selector: 'app-formations',
  templateUrl: 'formations.page.html',
  styleUrls: ['formations.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  providers: [
    //
  ],
})
export class FormationsPage implements OnInit
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  protected statuses!: Observable<Status[]|null>;

  protected filteredFormations!: Observable<Formation[]|null>;
  protected filteredEnrollments!: Observable<Enrollment[]|null>;

  protected selectedStatuses = new FormControl<Status[]>([]);

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    protected formationStoreService: FormationStoreService,
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

  ngOnInit(): void {
    this.statuses = this.statusStoreService.statuses$;

    // Listen to the either formations or user changes to update the filtered formations observable.
    this.filteredFormations = combineLatest([
      this.formationStoreService.formations$,
      this.authStoreService.user$
    ]).pipe(
      map(([formations, user]) => {
        if (!formations || !user) {
          return null;
        }

        return this.filterFormations(formations, user);
      })
    );

    // Listen to the auth store to keep the enrollments up to date.
    // Automatically filter on selectedStatuses change.
    this.filteredEnrollments = combineLatest([
      this.authStoreService.user$,
      this.selectedStatuses.valueChanges,
    ]).pipe(
      map(([user, statuses]) => {
        if (!user || !user.relations?.enrollments) return [];
        statuses = statuses ?? [];

        const enrollments = user.relations.enrollments;

        return this.filterEnrollmentsByStatus(enrollments, statuses);
      })
    );

    // Subscribe to the changes of the enrollment store
    // This will trigger on the post.
    this.enrollmentStoreService.createdEnrollment$.subscribe((enrollment: Enrollment|null) => {
      if (!enrollment) return;

      // When a new enrollment was changed, refresh the user.
      this.authStoreService.refreshUser();

      // Inform the user of the successul operation
      const message = `Your enrollment to the formation '${enrollment.formation!.name}' was received.`;
      this.snackBar.open(message, 'close');
    });

    // Listen to enrollment errors and throw them in the snackBar.
    this.enrollmentStoreService.error$.subscribe((error: ApiError | null) => {
      if (!error) return;

      this.snackBar.open(error.message, 'close');
    });

    // Refresh the user
    this.authStoreService.refreshUser();

    // Refresh the formations.
    this.formationStoreService.refreshFormations();

    // Refresh the statuses.
    this.statusStoreService.refreshStatuses();
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  /**
   * Filter out all the formations that the user cannot enroll to.
   * Using these criterias on the enrollment:
   * - It cannot be under review (pending)
   * - It cannot be approved
   *
   * @param formations Formation[]
   * @returns Formation[]
   */
  protected filterFormations(formations: Formation[], user: User): Formation[]
  {
    const userEnrollments = user.relations!.enrollments! ?? [];
    if (!userEnrollments.length)
      return formations;

    // filters all approved/pending enrollments of the user and map them to an array of formations id's.
    const filteredIds = userEnrollments.filter((enrollment: Enrollment) => {
      return (enrollment.isApproved() || enrollment.isPending());
    }).map((enrollment: any): number => {
      return enrollment.formation.id;
    });

    // Use these filtered Id's to filter out the formations that are available to enroll to.
    return formations.filter((formation: Formation) => {
      return !filteredIds.includes(formation.id);
    });
  }

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
   * Enroll the user to the given formation
   *
   * @param formation
   * @returns void
   */
  protected enroll(formation: Formation): void
  {
    const userId = this.authStoreService.user!.id;
    const formationId = formation.id;

    const body = {
      userId,
      formationId
    };

    // Call the enroll method from store.
    this.enrollmentStoreService.create(body);
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

    // Call the delete method from the store
    this.enrollmentStoreService.delete(enrollmentId);
  }

}
