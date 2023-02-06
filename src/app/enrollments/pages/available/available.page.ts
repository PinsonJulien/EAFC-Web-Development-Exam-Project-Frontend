import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { combineLatest, first, map, Observable, skip } from "rxjs";
import Enrollment from "src/app/core/models/Enrollment";
import Formation from "src/app/core/models/Formation";
import User from "src/app/core/models/User";
import AuthStoreService from "src/app/core/services/store/auth-store.service";
import EnrollmentStoreService from "src/app/core/services/store/enrollment-store.service";
import FormationStoreService from "src/app/core/services/store/formation-store.service";

@Component({
  standalone: true,
  selector: 'app-enrollments-available',
  templateUrl: 'available.page.html',
  styleUrls: ['available.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    //
  ],
})
export class AvailableEnrollmentsPage implements OnInit
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  protected filteredFormations!: Observable<Formation[]|null>;

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    protected formationStoreService: FormationStoreService,
    protected authStoreService: AuthStoreService,
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

    // Refresh the user
    this.authStoreService.refreshUser();

    // Refresh the formations.
    this.formationStoreService.refreshFormations();
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

      // Listen to the first new value, which will be the newly created enrollment.
      // Skip the original value and take the first one (which closes the subscription)
      this.enrollmentStoreService.createdEnrollment$
      .pipe(skip(1), first())
      .subscribe((enrollment: Enrollment|null) => {
        // refresh the user data
        this.authStoreService.refreshUser();

        if (!enrollment) return;

        // Inform the user of the successul operation
        const message = `Your enrollment to the formation '${enrollment.formation!.name}' was received.`;
        this.snackBar.open(message, 'close');
      });

      // Call the enroll method from store.
      this.enrollmentStoreService.create(body);
    }
}
