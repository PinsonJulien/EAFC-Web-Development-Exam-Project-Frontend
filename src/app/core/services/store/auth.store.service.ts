import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import User from "../../models/User";
import { ApiError } from "../../types/api/api-error";
import { LoginRequestBody } from "../../types/auth/login-request-body";
import { RegisterRequestBody } from "../../types/auth/register-request-body";
import AuthApiService from "../api/auth-api.service";

@Injectable({ providedIn: 'root'})
export default class AuthStoreService
{
  private _user = new BehaviorSubject<User | null>(null);
  public user = this._user.asObservable();

  private _error = new BehaviorSubject<ApiError | null>(null);
  public error = this._error.asObservable();

  constructor(
    private authApiService: AuthApiService,
  ) {
    //
  }

  /**
   * Login using the Auth api and update the behavior subjects using the results.
   *
   * @param credentials
   */
  public login(credentials: LoginRequestBody): void
  {
    this.authApiService.login(credentials).subscribe({
      next: (user: User) => {
        this._user.next(user);
        this._error.next(null);
      },
      error: (error: HttpErrorResponse) => {
        this._error.next(error.error);
      }
    });
  }

  /**
   * Register using the Auth api and update the behavior subjects using the results.
   *
   * @param body
   * @param picture
   */
  public register(body: RegisterRequestBody, picture?: File): void
  {
    this.authApiService.register(body, picture).subscribe({
      next: (user: User) => {
        this._user.next(user);
        this._error.next(null);
      },
      error: (error: HttpErrorResponse) => {
        this._error.next(error.error);
      }
    });
  }

}
