import { animate, state, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
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
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    //
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EnrollmentsAdminPage implements OnInit
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  // Data properties
  protected statuses!: Observable<Status[]|null>;
  protected enrollments!: Observable<Enrollment[]|null>;

  // UI properties
  protected tableColumns = ['formation', 'status', 'action'];
  protected expandedElement: Enrollment|null = null;

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
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
