import { Injectable } from "@angular/core";
import { map } from "rxjs";
import Country from "../../models/Country";
import { RequestAction } from "../../types/requests/request-action.enum";
import { ApiService } from "./api.service";


@Injectable({providedIn: 'root'})
export default class CountryApiService extends ApiService
{
  protected override readonly apiRoute: string = "api/v1/countries";

  public get(parameters = {})
  {
    return this.request(RequestAction.GET, '', parameters).pipe(
      map((response: any) => {
        return response.data.map((country: Country) => new Country(country));
      })
    );
  }
}
