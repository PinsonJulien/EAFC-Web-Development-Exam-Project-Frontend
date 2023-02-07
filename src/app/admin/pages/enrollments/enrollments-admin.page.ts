import { animate, state, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { combineLatest, first, Observable, skip, startWith } from "rxjs";
import Enrollment from "src/app/core/models/Enrollment";
import Formation from "src/app/core/models/Formation";
import Status from "src/app/core/models/Status";
import User from "src/app/core/models/User";
import AuthStoreService from "src/app/core/services/store/auth-store.service";
import EnrollmentStoreService from "src/app/core/services/store/enrollment-store.service";
import FormationStoreService from "src/app/core/services/store/formation-store.service";
import StatusStoreService from "src/app/core/services/store/status-store.service";
import { ApiError } from "src/app/core/types/api/api-error";
import { EnrollmentFilters } from "src/app/core/types/api/enrollments/enrollment-filters";
import { ExportEnrollmentsParams } from "src/app/core/types/api/enrollments/export-enrollments-params";
import { GetAllEnrollmentsParams } from "src/app/core/types/api/enrollments/get-all-enrollments-params";
import { UpdateEnrollmentBody } from "src/app/core/types/api/enrollments/update-enrollment-body";
import { ExportExtension } from "src/app/core/types/api/export-extention";
import { UserCardComponent } from "src/app/shared/components/user-card/user-card.component";

@Component({
  standalone: true,
  selector: 'app-admin-enrollments',
  templateUrl: 'enrollments-admin.page.html',
  styleUrls: ['enrollments-admin.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    UserCardComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
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
  protected user !: User|null;
  protected statuses!: Observable<Status[]|null>;
  protected formations!: Observable<Formation[]|null>;
  protected enrollments!: Observable<Enrollment[]|null>;

  // Refresh related properties
  protected enrollmentFilters: EnrollmentFilters = {};

  // Table properties
  protected tableColumns = ['formation', 'status', 'action'];
  protected expandedElement: Enrollment|null = null;

  // Update form properties
  protected updateStatusField = new FormControl<Status|null>(null, [
    Validators.required,
  ]);

  protected updateMessageField = new FormControl<string|null>(null);

  protected updateForm = new FormGroup({
    status: this.updateStatusField,
    message: this.updateMessageField,
  });

  // Filtering properties
  protected statusFilter = new FormControl<Status|null>(null);
  protected formationFilter = new FormControl<Formation|null>(null);

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    protected authStoreService: AuthStoreService,
    protected enrollmentStoreService: EnrollmentStoreService,
    protected statusStoreService: StatusStoreService,
    protected formationStoreService: FormationStoreService,
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
    this.user = this.authStoreService.user;
    // Create references to the stores observables.
    this.statuses = this.statusStoreService.statuses$;
    this.formations = this.formationStoreService.formations$;
    this.enrollments = this.enrollmentStoreService.enrollments$;

    // Refresh data, if necessary.
    this.refreshEnrollments();

    if (!this.statusStoreService.statuses)
      this.statusStoreService.refreshStatuses();

    if (!this.formationStoreService.formations)
      this.formationStoreService.refreshFormations();

    // Listen to filter changes and refresh the page
    combineLatest([
      this.statusFilter.valueChanges.pipe(startWith(null)),
      this.formationFilter.valueChanges.pipe(startWith(null))
    ]).subscribe(([statusFilter, formationFilter]: [statusFilter: Status | null, formationFilter: Formation | null]) => {
      // refresh the filter property
      this.enrollmentFilters = {};
      if (statusFilter)
        this.enrollmentFilters.statusId = statusFilter.id;
      if (formationFilter)
        this.enrollmentFilters.formationId = formationFilter.id;

      // refresh the enrollments.
      this.refreshEnrollments();
    });
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  /**
   * Sends the form data to the EnrollmentStore update method
   * On success: shows a message and refresh the store data
   * On error: shows a message.
   *
   * @returns void
   */
  public onUpdateSubmit(): void
  {
    if (!this.expandedElement && !this.updateForm.valid) return;

    const enrollmentId = this.expandedElement!.id;

    const body: UpdateEnrollmentBody = {
      statusId: this.updateStatusField.value!.id
    }

    const message = this.updateMessageField.value;
    if (message)
      body.message = message;

    // Use the form data to update the enrollment.
    this.enrollmentStoreService.update(enrollmentId, body);

    // Listen to next value from updatedEnrollment
    this.enrollmentStoreService.updatedEnrollment$
    .pipe(skip(1), first())
    .subscribe((enrollment: Enrollment|null) => {
      if (!enrollment) return;

      // Refresh the data set
      this.enrollmentStoreService.refreshEnrollments();

      // Reset the form fields.
      this.resetUpdateFormFields();

      // Notify
      this.snackBar.open(`The enrollment n°${enrollment.id} was successfully updated.`, 'close');
    });

    // Listen to the next error
    this.enrollmentStoreService.error$
    .pipe(skip(1), first())
    .subscribe((error: ApiError|null) => {
      if (!error) return;

      // Notify
      this.snackBar.open(error.message, 'close');
    });
  }

  /**
   * Reset all update form fields values
   *
   * @returns void
   */
  protected resetUpdateFormFields() : void
  {
    this.updateForm.reset();
  }

  /**
   * Refresh the enrollments using the store and the generated options
   * Handles : filters
   *
   * @returns void
   */
  protected refreshEnrollments(): void
  {
    const options: GetAllEnrollmentsParams = {};

    if (Object.keys(this.enrollmentFilters).length)
      options.filters = this.enrollmentFilters;

    this.enrollmentStoreService.refreshEnrollments(options);
  }

  /**
   * Triggers a request to export the data
   * Handles: filters
   *
   * @param extension ExportExtension
   * @retuns void
   */
  protected export(extension: ExportExtension): void
  {
    const options: ExportEnrollmentsParams = {};

    if (Object.keys(this.enrollmentFilters).length)
      options.filters = this.enrollmentFilters;

    this.enrollmentStoreService.export(extension, options);
  }

}
