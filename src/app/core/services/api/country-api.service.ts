import { Injectable } from "@angular/core";
import { map } from "rxjs";
import Country from "../../models/Country";
import { RequestAction } from "../../types/requests/request-action.enum";
import { ApiService } from "./api.service";


@Injectable({providedIn: 'root'})
export default class CountryApiService extends ApiService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  protected override readonly apiRoute: string = "api/v1/countries";

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

  /**
   * Fetch all countries and stream them as Observable.
   * On success the data is mapped to an array of countries.
   *
   * @param parameters object
   * @returns
   */
  public get(parameters = {})
  {
    return this.request(RequestAction.GET, '', parameters).pipe(
      map((response: any) => {
        return response.data.map((country: Country) => new Country(country));
      })
    );
  }
}
