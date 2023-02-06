import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RequestAction } from "../../types/requests/request-action.enum";
import { ApiService } from "./api.service";

@Injectable({providedIn: 'root'})
export default class CsrfApiService extends ApiService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  protected override readonly apiRoute: string = "sanctum";

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

  public getToken(): Observable<Object>
  {
    return this.request(RequestAction.GET, 'csrf-cookie');
  }
}
