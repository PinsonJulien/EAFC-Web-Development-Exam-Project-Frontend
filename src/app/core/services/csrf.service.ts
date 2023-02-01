import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { RequestAction } from "./Types/Requests/RequestAction";

@Injectable({providedIn: 'root'})
export default class CsrfService extends ApiService
{

  protected override readonly apiRoute: string = "sanctum";

  public getToken(): Observable<Object>
  {
    return this.request(RequestAction.GET, 'csrf-cookie');
  }
}
