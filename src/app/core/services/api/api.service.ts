import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { RequestAction } from "../../types/requests/request-action.enum";
import { RequestParameters } from "../../types/requests/request-parameters";

@Injectable({providedIn: 'root'})
export class ApiService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  // Why "//" instead of "http" -> angular will ignore the cookie setup to X-XSRF-TOKEN header.
  // https://stackoverflow.com/questions/50510998/angular-6-does-not-add-x-xsrf-token-header-to-http-request
  protected readonly apiURL: string = `//${environment.baseUrl}`;

  protected readonly apiRoute: string = "";

  protected readonly httpOptions = {
    headers: new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Accept' : 'application/json',
    }),
    withCredentials: true, // Absolutely needed parameter for session cookies.
  };

  /**************************************************/
  //
  // Constructor
  //
  /**************************************************/

  constructor(
    protected http: HttpClient
  ) {
    //
  }

  /**************************************************/
  //
  // Getters / setters
  //
  /**************************************************/

  //

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

  /**
   * Call the given path api endpoint using a specified action, body and options.
   * Will stream a Observable of the dynamic type <T>.
   * <T> can either be an object or an array of objects.
   *
   * @param action RequestAction
   * @param path string | number
   * @param parameters RequestParameter
   * @param body Object
   * @returns Observable<T>
   */
  protected request<T extends (object|object[]|void)>(
    action: RequestAction,
    path: string|number,
    parameters: RequestParameters = {},
    body: Object = {}
  ): Observable<T>
  {
    const url = `${this.apiURL}/${this.apiRoute}/${path}`;

    const params = new HttpParams({ fromObject: parameters });

    const options = {
      ...this.httpOptions,
      params: params,
    };

    switch (action) {
      case RequestAction.GET :
        return this.http.get<T>(url, options);

      case RequestAction.POST :
        return this.http.post<T>(url, body, options);

      case RequestAction.PUT :
        return this.http.put<T>(url, body, options);

      case RequestAction.PATCH :
        return this.http.patch<T>(url, body, options);

      case RequestAction.DELETE :
        return this.http.delete<T>(url, options);

      default :
        throw new Error(`Invalid HTTP action : ${action}`);
    }
  }

  /**
   * Call the given path on GET request expecting a response type of "text"
   *
   * @param path string|number
   * @param parameters RequestParameters
   * @returns Observable<any>
   */
  protected exportRequest(
    path: string|number,
    parameters: RequestParameters = {},
  ): Observable<any>
  {
    const url = `${this.apiURL}/${this.apiRoute}/${path}`;

    const params = new HttpParams({ fromObject: parameters });

    return this.http.get(url, {
      ...this.httpOptions,
      params: params,
      responseType: 'text'
    });
  }

}
