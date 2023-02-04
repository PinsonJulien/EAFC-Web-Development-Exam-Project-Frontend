import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import User from "../../models/User";
import { ApiService } from "./api.service";
import { LoginRequestBody } from "../../types/auth/login-request-body";
import { RegisterRequestBody } from "../../types/auth/register-request-body";
import { RequestAction } from "../../types/requests/request-action.enum";

@Injectable({providedIn: 'root'})
export default class AuthApiService extends ApiService
{
  protected override readonly apiRoute: string = "api/v1/auth";

  /**
   * Call the /login api endpoint and stream as Observable.
   * On success the data is mapped to a User model.
   *
   * @param body LoginRequestBody
   * @returns Observable<User>
   */
  public login(body: LoginRequestBody): Observable<User>
  {
    return this.request<User>(RequestAction.POST, 'login', {}, body).pipe(
      map((response: any) => {
        return new User(response.data);
      })
    );
  }

  /**
   * Call the /register api endpoint and stream as Observable.
   * On success the data is mapped to a User mode.
   * Will transform the given body to a FormData to include the picture.
   *
   * @param body RegisterRequestBody
   * @param picture File
   * @returns Observable<User>
   */
  public register(body: RegisterRequestBody, picture?: File): Observable<User>
  {
    // Object body must be converted to a FormData to be able to send the picture.
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      formData.append(key, String(value))
    }

    if (picture)
      formData.append('picture', picture);


    return this.request<User>(RequestAction.POST, 'register', {}, formData).pipe(
      map((response: any) => {
        return new User(response.data);
      })
    )
  }

  /**
   * Call the /logout api endpoint and stream as Observable.
   * The expected result is a no content request.
   *
   * @returns Observable<void>
   */
  public logout(): Observable<void>
  {
    return this.request(RequestAction.POST, 'logout');
  }
}
