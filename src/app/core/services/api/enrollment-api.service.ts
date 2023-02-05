import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import Enrollment from "../../models/Enrollment";
import { CreateEnrollmentBody } from "../../types/api/enrollments/create-enrollment-body";
import { RequestAction } from "../../types/requests/request-action.enum";
import { ApiService } from "./api.service";

@Injectable({providedIn: 'root'})
export default class EnrollmentApiService extends ApiService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/
  protected override readonly apiRoute: string = "api/v1/enrollments";

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

  /**
   * Create a new enrollment and stream it as Observable.
   * On success the data is mapped to an instance of Enrollment.
   *
   * @param body CreateEnrollmentBody
   */
  public create(body: CreateEnrollmentBody): Observable<Enrollment>
  {
    return this.request<Enrollment>(RequestAction.POST, '', {}, body).pipe(
      map((response: any) => {
        return new Enrollment(response.data);
      })
    )
  }

  /**
   * Delete a given enrollment and stream it as Observable.
   * The expected result is a no content response.
   *
   * @param id number
   * @returns Observable<void>
   */
  public delete(id: number): Observable<void>
  {
    return this.request<void>(RequestAction.DELETE, id);
  }

}
