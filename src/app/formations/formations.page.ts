import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { map, Observable, take } from "rxjs";
import Enrollment from "../core/models/Enrollment";
import Formation from "../core/models/Formation";
import AuthStoreService from "../core/services/store/auth.store.service";
import FormationStoreService from "../core/services/store/formation.store.service";
import {MatExpansionModule} from '@angular/material/expansion';
import EnrollmentStoreService from "../core/services/store/enrollment-store.service";
import { ApiError } from "../core/types/api/api-error";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";

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
  ],
  providers: [],
})
export class FormationsPage implements OnInit
{
  /************************************************************/
  // Properties
  /************************************************************/
  protected _userEnrollments: Enrollment[] = [];
  protected filteredFormations!: Observable<Formation[]|null>;

  /************************************************************/
  // Constructor
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
  // Implemented Methods
  /************************************************************/

  ngOnInit(): void {
    // Listen to the formation array from the store.
    this.filteredFormations = this.formationStoreService.formations$.pipe(
      map((formations: Formation[] | null) => {
        if (!formations) return null;

        return this.filterFormations(formations);
      })
    );

    // Get all user enrollments.
    this._userEnrollments = this.authStoreService.user?.relations?.enrollments ?? [];

    // Refresh the formations.
    this.formationStoreService.refreshFormations();

    // Listen to enrollment errors and throw them in the snackBar.
    this.enrollmentStoreService.error$.subscribe((error: ApiError | null) => {
      if (!error) return;

      this.snackBar.open(error.message, 'close');
    });
  }

  /************************************************************/
  // Methods
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
  protected filterFormations(formations: Formation[]): Formation[]
  {
    // filters all approved/pending enrollments of the user and map them to an array of formations id's.
    const filteredIds = this._userEnrollments.filter((enrollment: Enrollment) => {
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
   * On success the formation is filtered out from the filteredFormations observable.
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

    // Subscribe to the next change of the enrollment store
    this.enrollmentStoreService.enrollment$.pipe(take(1))
      .subscribe((enrollment: Enrollment|null) => {
        if (!enrollment) return;

        // The enrollment was successful, remove the formation from the filtered list.
        this.filteredFormations = this.filteredFormations.pipe(
          map((formations: Formation[]|null) => {
            if (!formations) return null;
            return formations.filter((formation: Formation) => formation.id !== formationId);
          })
        );

        // Inform the user of the successul operation
        const message = `Your enrollment to the formation '${formation.name}' was received.`;
        this.snackBar.open(message, 'close');

      });

    // Call the enroll method from store.
    this.enrollmentStoreService.create(body);
  }
}
