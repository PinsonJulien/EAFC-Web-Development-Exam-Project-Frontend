import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import Enrollment from "../core/models/Enrollment";
import Formation from "../core/models/Formation";
import AuthStoreService from "../core/services/store/auth.store.service";
import FormationStoreService from "../core/services/store/formation.store.service";
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  standalone: true,
  selector: 'app-formations',
  templateUrl: 'formations.page.html',
  styleUrls: ['formations.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatExpansionModule,

  ],
  providers: [],
})
export class FormationsPage implements OnInit
{
  // Properties
  protected _userEnrollments: Enrollment[] = [];
  protected filteredFormations!: Observable<Formation[]|null>;

  constructor(
    protected formationStoreService: FormationStoreService,
    protected authStoreService: AuthStoreService,
  ) {
    //
  }

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
  }

  // Methods

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

}
