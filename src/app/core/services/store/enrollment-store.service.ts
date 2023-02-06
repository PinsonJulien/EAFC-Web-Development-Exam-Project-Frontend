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

  protected _createdEnrollment = new BehaviorSubject<Enrollment | null>(null);
  public createdEnrollment$ = this._createdEnrollment.asObservable();

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

}
