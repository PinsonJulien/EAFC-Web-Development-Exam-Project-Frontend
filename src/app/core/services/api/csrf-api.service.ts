import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RequestAction } from "../Types/Requests/RequestAction";
import { ApiService } from "./api.service";

@Injectable({providedIn: 'root'})
export default class CsrfApiService extends ApiService
{

  protected override readonly apiRoute: string = "sanctum";

  public getToken(): Observable<Object>
  {
    return this.request(RequestAction.GET, 'csrf-cookie');
  }
}
