import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { RequestAction } from "./Types/Requests/RequestAction";

@Injectable({providedIn: 'root'})
export class ApiService {

  // Why "//" instead of "http" -> angular will ignore the cookie setup to X-XSRF-TOKEN header.
  // https://stackoverflow.com/questions/50510998/angular-6-does-not-add-x-xsrf-token-header-to-http-request
  protected readonly apiURL: string = `//${environment.baseUrl}`;

  protected readonly apiRoute: string = "";

  protected readonly httpOptions = {
    headers: new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type' : 'application/json',
      'Accept' : 'application/json',
    }),
    withCredentials: true, // Absolutely needed parameter for session cookies.
  };

  constructor( public http: HttpClient, private router: Router ) {
    //
  }

  protected request(action: RequestAction, path: string, parameters: RequestParameters = {}, body: Object = {}): Observable<Object>
  {
    const url = `${this.apiURL}/${this.apiRoute}/${path}`;

    const params = new HttpParams();
    params.appendAll(parameters);

    const options = {
      ...this.httpOptions,
      parameters: params
    };

    switch (action) {
      case RequestAction.GET :
        return this.http.get(url, options);

      case RequestAction.POST :
        return this.http.post(url, body, options);

      case RequestAction.PUT :
        return this.http.put(url, body, options);

      case RequestAction.PATCH :
        return this.http.patch(url, body, options);

      case RequestAction.DELETE :
        return this.http.delete(url, options);

      default :
        throw new Error(`Invalid HTTP action : ${action}`);
    }
  }
}
