import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import Formation from "../../models/Formation";
import { RequestAction } from "../../types/requests/request-action.enum";
import { RequestParameters } from "../../types/requests/request-parameters";
import { ApiService } from "./api.service";

@Injectable({providedIn: 'root'})
export default class FormationApiService extends ApiService
{
  protected override readonly apiRoute: string = "api/v1/formations";

  /**
   * Fetch all formations and stream them as Observable.
   * On success the data is mapped to an array of formations.
   *
   * @returns Observable<Formation[]>
   */
  public get(parameters: RequestParameters): Observable<Formation[]>
  {
    return this.request<Formation[]>(RequestAction.GET, '', parameters).pipe(
      map((response: any) => {
        return response.data.map((formation: Formation) => new Formation(formation));
      })
    );
  }
}
