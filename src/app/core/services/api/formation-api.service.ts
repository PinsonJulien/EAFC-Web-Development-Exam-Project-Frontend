import { Injectable } from "@angular/core";
import { map } from "rxjs";
import Formation from "../../models/Formation";
import { RequestAction } from "../Types/Requests/RequestAction";
import { ApiService } from "./api.service";

@Injectable({providedIn: 'root'})
export default class FormationApiService extends ApiService
{
  protected override readonly apiRoute: string = "api/v1/formations";

  public get(parameters = {})
  {
    return this.request(RequestAction.GET, '', parameters).pipe(
      map((response: any) => {
        return response.data.map((formation: Formation) => new Formation(formation));
      })
    );
  }
}
