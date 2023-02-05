import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import Status from "../../models/Status";
import { RequestAction } from "../../types/requests/request-action.enum";
import { ApiService } from "./api.service";

@Injectable({providedIn: 'root'})
export default class StatusApiService extends ApiService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  protected override readonly apiRoute: string = "api/v1/statuses";

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

  /**
   * Fetch all statuses and stream them as Observable.
   * On success the data is mapped to an array of status.
   *
   * @returns Observable<Status[]>
   */
  public get(): Observable<Status[]>
  {
    return this.request<Status[]>(RequestAction.GET, '').pipe(
      map((response: any) => {
        return response.data.map((status: Status) => new Status(status));
      })
    )
  }

}
