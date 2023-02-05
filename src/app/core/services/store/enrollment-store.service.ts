import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Enrollment from "../../models/Enrollment";
import { CreateEnrollmentBody } from "../../types/api/enrollments/create-enrollment-body";
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

  protected _enrollment = new BehaviorSubject<Enrollment | null>(null);
  public enrollment$ = this._enrollment.asObservable();

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
   * Get the current enrollment from the behavior subject.
   *
   * @returns Enrollment | null
   */
  public get enrollment(): Enrollment| null
  {
    return this._enrollment.getValue();
  }

  /**
   * Set the value of the enrollment behavior subject.
   *
   * @param enrollment Enrollment | null
   * @returns void
   */
  protected set enrollment(enrollment: Enrollment | null)
  {
    this._enrollment.next(enrollment);
  }

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

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
        this.enrollment = enrollment;
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
        this.enrollment = null;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error;
      }
    });
  }

}
