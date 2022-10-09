import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { switchMap } from "rxjs";
import { environment } from "src/environments/environment";

// Why "//" instead of "http" -> angular will ignore the cookie setup to X-XSRF-TOKEN header.
// https://stackoverflow.com/questions/50510998/angular-6-does-not-add-x-xsrf-token-header-to-http-request

@Injectable({ providedIn: 'root'})
export class AuthService {
  private apiURL = `//${environment.baseUrl}`;

  private httpOptions = {
    headers: new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type' : 'application/json',
      'Accept' : 'application/json',
    }),
    withCredentials: true
  };

  constructor(
    private http: HttpClient,
  ) {

  }

  private csrf() {
    const request = this.http.get(`${this.apiURL}/sanctum/csrf-cookie`, this.httpOptions)
    request.subscribe((e) => {console.log(e)});
    return request;
  }

  public register(name: string, email: string, password: string, password_confirmation: string) {
    const body = {
      name,
      email,
      password,
      password_confirmation
    }

    return this.csrf()
      .pipe(
        switchMap(() => {
          return this.http.post(`${this.apiURL}/register`, body, this.httpOptions);
        })
      );
  }

  public login(email: string, password: string) {
    const body = {
      email,
      password
    };

    return this.csrf()
      .pipe(
        switchMap(() => {
          return this.http.post(`${this.apiURL}/login`, body, this.httpOptions);
        })
      );
  }

  public logout() {
    const body = {};

    return this.csrf()
      .pipe(
        switchMap(() => {
          return this.http.post(`${this.apiURL}/logout`, body, this.httpOptions);
        })
      );
  }

  public user() {
    return this.http.get(`${this.apiURL}/api/user`, this.httpOptions);
  }
}
