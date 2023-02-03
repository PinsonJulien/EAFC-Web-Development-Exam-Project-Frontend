import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import User from "../../models/User";
import { ApiError } from "../../types/api/api-error";
import { LoginRequestBody } from "../../types/auth/login-request-body";
import { RegisterRequestBody } from "../../types/auth/register-request-body";
import AuthApiService from "../api/auth-api.service";
import { LocalStorageService } from "../local-storage/local-storage.service";

@Injectable({ providedIn: 'root'})
export default class AuthStoreService
{
  private _user = new BehaviorSubject<User | null>(null);
  public user$ = this._user.asObservable();

  private _error = new BehaviorSubject<ApiError | null>(null);
  public error$ = this._error.asObservable();

  constructor(
    private authApiService: AuthApiService,
    private localStorageService: LocalStorageService,
  ) {
    // On instantiation, the store service will retrieve the locally stored user.
    this._user.next(
      this.retrieveUser()
    );
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

        // Save in local storage
        this.storeUser(user);
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

        // Save in local storage
        this.storeUser(user);
      },
      error: (error: HttpErrorResponse) => {
        this._error.next(error.error);
      }
    });
  }


  // Local storage methods for data persistance.

  /**
   * Retrieve the user model that is stored in the local storage.
   *
   * @return User | null
   */
  protected retrieveUser(): User | null
  {
    const user = this.localStorageService.getItem('user');

    return (user)
      ? new User(user)
      : null;
  }

  /**
   * Store the user model to the local storage for data persistance.
   *
   * @param user User
   * @return void
   */
  protected storeUser(user: User): void
  {
    this.localStorageService.setItem('user', user);
  }

  /**
   * Remove the user model from the local storage
   *
   * @return void
   */
  protected removeUser(): void
  {
    this.localStorageService.removeItem('user');
  }
}
