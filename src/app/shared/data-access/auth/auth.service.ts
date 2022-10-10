import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, throwError } from "rxjs";
import { environment } from "src/environments/environment";

// Why "//" instead of "http" -> angular will ignore the cookie setup to X-XSRF-TOKEN header.
// https://stackoverflow.com/questions/50510998/angular-6-does-not-add-x-xsrf-token-header-to-http-request

@Injectable({ providedIn: 'root'})
export class AuthService {
  public static isLogged: boolean = false;

  private readonly apiURL = `//${environment.baseUrl}`;

  private readonly httpOptions = {
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
    return this.http.get(`${this.apiURL}/sanctum/csrf-cookie`, this.httpOptions);
  }

  public async register(name: string, email: string, password: string, password_confirmation: string) {
    const body = {
      name,
      email,
      password,
      password_confirmation
    }

    try {
      await firstValueFrom(this.csrf());
      return this.http.post(`${this.apiURL}/register`, body, this.httpOptions);
    } catch(e:any) {
      return throwError(() => new Error(e))
    }
  }

  public async login(email: string, password: string) {
    const body = {
      email,
      password
    };

    try {
      await firstValueFrom(this.csrf());
      return this.http.post(`${this.apiURL}/login`, body, this.httpOptions);
    } catch( e:any ) {
      return throwError(() => new Error(e))
    }
  }

  public async logout() {
    const body = {};

    try {
      await firstValueFrom(this.csrf());
      return this.http.post(`${this.apiURL}/logout`, body, this.httpOptions);
    } catch( e:any ) {
      return throwError(() => new Error(e))
    }
  }

  public user() {
    return this.http.get(`${this.apiURL}/api/user`, this.httpOptions);
  }
}
