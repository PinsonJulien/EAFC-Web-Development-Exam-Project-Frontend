import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import Enrollment from "../../models/Enrollment";
import { CreateEnrollmentBody } from "../../types/api/enrollments/create-enrollment-body";
import { ExportEnrollmentsParams } from "../../types/api/enrollments/export-enrollments-params";
import { GetAllEnrollmentsParams } from "../../types/api/enrollments/get-all-enrollments-params";
import { UpdateEnrollmentBody } from "../../types/api/enrollments/update-enrollment-body";
import { ExportExtension } from "../../types/api/export-extention";
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
   * Fetch all enrollments and stream them as Observable.
   * On success the data is mapped to an array of Enrollment.
   * Use the given params to prepare a specific request.
   *
   * @param params GetAllEnrollmentsParams
   * @returns Observable<Enrollment[]>
   */
  public get(params: GetAllEnrollmentsParams = {}): Observable<Enrollment[]>
  {
    const parameters: any = {};

    // Prepare the filter parameters
    if (params) {
      const filters = params.filters;
      if (filters) {
        if (filters.formationId)
          parameters['formationId[eq]'] = filters.formationId;
        if (filters.statusId)
          parameters['statusId[eq]'] = filters.statusId;
        if (filters.userId)
          parameters['userId[eq]'] = filters.userId;
      }
    }

    return this.request<Enrollment[]>(RequestAction.GET, '', parameters).pipe(
      map((response: any) => {
        return response.data.map((enrollment: Enrollment) => new Enrollment(enrollment));
      })
    );
  }

  /**
   * Create a new enrollment and stream it as Observable.
   * On success the data is mapped to an instance of Enrollment.
   *
   * @param body CreateEnrollmentBody
   * @returns Observable<Enrollment>
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
   * Update a given enrollment and stream it as Observable.
   * On success the data is mapped to an instance of Enrollment.
   *
   * @param id number
   * @param body UpdateEnrollmentBody
   * @returns Observable<Enrollment>
   */
  public update(id: number, body: UpdateEnrollmentBody): Observable<Enrollment>
  {
    return this.request<Enrollment>(RequestAction.PATCH, id, {}, body).pipe(
      map((response: any) => {
        return new Enrollment(response.data);
      })
    );
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

  /**
   * Export all enrollments and stream them as Observable.
   * On success the data is mapped to an array of Enrollment.
   * Use the given params to prepare a specific request.
   *
   * @param extension ExportExtension
   * @param params ExportEnrollmentsParams
   * @returns Observable<Enrollment[]>
   */
  public export(extension: ExportExtension, params: ExportEnrollmentsParams = {}): Observable<any>
  {
    const parameters: any = {
      extension,
    };

    // Prepare the filter parameters
    if (params) {
      const filters = params.filters;
      if (filters) {
        if (filters.formationId)
          parameters['formationId[eq]'] = filters.formationId;
        if (filters.statusId)
          parameters['statusId[eq]'] = filters.statusId;
        if (filters.userId)
          parameters['userId[eq]'] = filters.userId;
      }
    }

    return this.exportRequest('export', parameters);
  }

}
