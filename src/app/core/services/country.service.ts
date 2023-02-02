import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map } from "rxjs";
import { RequestAction } from "./Types/Requests/RequestAction";
import Country from "../models/Country";

@Injectable({providedIn: 'root'})
export default class CountryService extends ApiService
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
