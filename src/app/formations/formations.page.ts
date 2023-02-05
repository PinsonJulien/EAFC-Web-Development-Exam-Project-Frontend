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

@Component({
  standalone: true,
  selector: 'app-formations',
  templateUrl: 'formations.page.html',
  styleUrls: ['formations.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
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

  ngOnInit(): void {
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

    // Subscribe to the changes of the enrollment store
    // This will trigger on the post.
    this.enrollmentStoreService.enrollment$.subscribe((enrollment: Enrollment|null) => {
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

    // Call the enroll method from store.
    this.enrollmentStoreService.create(body);
  }
}
