import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Enrollment from "../../models/Enrollment";
import { CreateEnrollmentBody } from "../../types/api/enrollments/create-enrollment-body";
import { ExportEnrollmentsParams } from "../../types/api/enrollments/export-enrollments-params";
import { GetAllEnrollmentsParams } from "../../types/api/enrollments/get-all-enrollments-params";
import { UpdateEnrollmentBody } from "../../types/api/enrollments/update-enrollment-body";
import { ExportExtension } from "../../types/api/export-extention";
import EnrollmentApiService from "../api/enrollment-api.service";
import StoreService from "./store.service";

@Injectable({ providedIn: 'root'})
export default class EnrollmentStoreService extends StoreService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  protected _enrollments = new BehaviorSubject<Enrollment[] | null>(null);
  public enrollments$ = this._enrollments.asObservable();

  protected _createdEnrollment = new BehaviorSubject<Enrollment | null>(null);
  public createdEnrollment$ = this._createdEnrollment.asObservable();

  protected _updatedEnrollment = new BehaviorSubject<Enrollment | null>(null);
  public updatedEnrollment$ = this._updatedEnrollment.asObservable();

  protected _deletedEnrollment = new BehaviorSubject<boolean>(false);
  public deletedEnrollment$ = this._deletedEnrollment.asObservable();

  /**************************************************/
  //
  // Constructor
  //
  /**************************************************/

  constructor(
    protected enrollmentApiService: EnrollmentApiService,
  ) {
    super();
  }

  /**************************************************/
  //
  // Getters / setters
  //
  /**************************************************/

  /**
   * Get the current enrollments from the behavior subject.
   *
   * @returns Enrollment[] | null
   */
  public get enrollments(): Enrollment[] | null
  {
    return this._enrollments.getValue();
  }

  /**
  * Set the value of the enrollments behavior subject.
  *
  * @param enrollments Formation[] | null
  * @returns void
  */
  protected set enrollments(enrollments: Enrollment[] | null)
  {
    this._enrollments.next(enrollments);
  }

  /**
   * Get the current createdEnrollment from the behavior subject.
   *
   * @returns Enrollment | null
   */
  public get createdEnrollment(): Enrollment| null
  {
    return this._createdEnrollment.getValue();
  }

  /**
   * Set the value of the createdEnrollment behavior subject.
   *
   * @param createdEnrollment Enrollment | null
   * @returns void
   */
  protected set createdEnrollment(createdEnrollment: Enrollment | null)
  {
    this._createdEnrollment.next(createdEnrollment);
  }

  /**
   * Get the current updatedEnrollment from the behavior subject.
   *
   * @returns Enrollment | null
   */
  public get updatedEnrollment(): Enrollment| null
  {
    return this._updatedEnrollment.getValue();
  }

  /**
  * Set the value of the updatedEnrollment behavior subject.
  *
  * @param updatedEnrollment Enrollment | null
  * @returns void
  */
  protected set updatedEnrollment(updatedEnrollment: Enrollment | null)
  {
    this._updatedEnrollment.next(updatedEnrollment);
  }

  /**
   * Get the current deletedEnrollment from the behavior subject.
   *
   * @returns boolean
   */
   public get deletedEnrollment(): boolean
   {
     return this._deletedEnrollment.getValue();
   }

   /**
    * Set the value of the deletedEnrollment behavior subject.
    *
    * @param deletedEnrollment boolean
    * @returns void
    */
   protected set deletedEnrollment(deletedEnrollment: boolean)
   {
     this._deletedEnrollment.next(deletedEnrollment);
   }

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

   /**
    * Refresh the list of enrollments and update it's behavior subject.
    * Uses the EnrollmentApiService to get all enrollments.
    *
    * @returns void
    */
  public refreshEnrollments(options: GetAllEnrollmentsParams = {}): void
  {
    this.enrollmentApiService.get(options).subscribe({
      next: (enrollments: Enrollment[]) => {
        this.enrollments = enrollments;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error;
      }
    });
  }

  /**
   * Create a new enrollment using the Enrollment api.
   * Streams the new enrollment if created or the error received.
   *
   * @param body CreateEnrollmentBody
   * @returns void
   */
  public create(body: CreateEnrollmentBody): void
  {
    this.enrollmentApiService.create(body).subscribe({
      next: (enrollment: Enrollment) => {
        this.createdEnrollment = enrollment;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error;
      }
    });
  }

  /**
   * Update a given enrollment using the Enrollment api
   * Streams the updated enrollment on success, or the error received.
   *
   * @param id number
   * @param body UpdateEnrollmentBody
   */
  public update(id: number, body: UpdateEnrollmentBody): void
  {
    this.enrollmentApiService.update(id, body).subscribe({
      next: (enrollment: Enrollment) => {
        this.updatedEnrollment = enrollment;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error;
      }
    });
  }

  /**
   * Delete a given enrollment using the Enrollment api
   * Streams errors
   *
   * @param id number
   * @returns void
   */
  public delete(id: number): void
  {
    this.enrollmentApiService.delete(id).subscribe({
      next: () => {
        this.deletedEnrollment = true;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        this.deletedEnrollment = false;
        this.error = error.error;
      }
    });
  }

  /**
   * Export all enrollments using parameters, automatically triggers the download.
   * Uses the EnrollmentApiService to export.
   *
   * @param extension ExportExtension
   * @param options ExportEnrollmentsParams
   */
  public export(extension: ExportExtension, options: ExportEnrollmentsParams): void
  {
    this.enrollmentApiService.export(extension, options).subscribe(
      {
        next: (data:any) => {
          // On success, trigger the file download.
          const blob = new Blob([data], { type: 'text/'+extension});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'enrollments.'+extension;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);

          this.error = null;
        },
        error: (error: HttpErrorResponse) => {
          this.error = error.error;
        }
      }
    );
  }
}
