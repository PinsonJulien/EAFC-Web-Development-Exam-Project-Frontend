import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import User, { UserRelations } from "../../models/User";
import { ApiError } from "../../types/api/api-error";
import { LoginRequestBody } from "../../types/auth/login-request-body";
import { RegisterRequestBody } from "../../types/auth/register-request-body";
import AuthApiService from "../api/auth-api.service";
import UserApiService from "../api/user-api.service";
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
    private userApiService: UserApiService,
  ) {
    // On instantiation, the store service will retrieve the locally stored user.
    this.user = this.retrieveUserFromLocalStorage();

    // Refresh the user to get it's relational data.
    this.refreshUser();
  }

  // GETTERS SETTERS

  /**
   * Get the current user from the behavior subject.
   *
   * @returns User | null
   */
  public get user(): User | null
  {
    return this._user.getValue()
  }

  /**
   * Set the value of the user behavior subject and add/remove it from the localstore.
   *
   * @returns void
   */
  protected set user(user: User | null)
  {
    if (!user) this.removeUserFromLocalStorage();
    else this.storeUserInLocalStorage(user);

    this._user.next(user);
  }

  /**
   * Get the current error from the behavior subject.
   *
   * @returns ApiError | null
   */
  public get error(): ApiError | null
  {
    return this._error.getValue();
  }

  /**
   * Set the value of the error behavior subject.
   *
   */
  protected set error(error: ApiError | null)
  {
    this._error.next(error);
  }

  // METHODS

  /**
   * Login using the Auth api and update the behavior subjects using the results.
   *
   * @param credentials LoginRequestBody
   * @returns void
   */
  public login(credentials: LoginRequestBody): void
  {
    this.authApiService.login(credentials).subscribe({
      next: (user: User) => {
        this.user = user;
        this.error = null;

        // Refresh the user to get it's relational data.
        this.refreshUser();
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error;
      }
    });
  }

  /**
   * Register using the Auth api and update the behavior subjects using the results.
   *
   * @param body RegisterRequestBody
   * @param picture File | null
   * @returns void
   */
  public register(body: RegisterRequestBody, picture?: File): void
  {
    this.authApiService.register(body, picture).subscribe({
      next: (user: User) => {
        this.user = user;
        this.error = null;

        // Refresh the user to get it's relational data.
        this.refreshUser();
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error;
      }
    });
  }

  /**
   * Disconnect the current user and update the behavior sujects using the result.
   * On success the user is removed
   * On error, if the error is 401 => remove, because the session expired.
   *
   * @returns void
   */
  public logout(): void
  {
    this.authApiService.logout().subscribe({
      next: () => {
        this.user = null;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        // If the session expired reset both user & error.
        if (error.status === 401) {
          this.user = null;
          this.error = null;
          return;
        }

        this.error = error.error;
      }
    });
  }

  /**
   * Refresh the current authenticated user and update it's behavior subject.
   * Uses the UserApiService getById and asks for specific relations to be included.
   *
   * @returns void
   */
  public refreshUser(): void
  {
    if (!this.user) {
      this.error = {
        message: "No user is currently set in the store.",
        errors: {}
      };

      return;
    }

    const id = this.user.id;

    // Include relations
    const relations: UserRelations[] = [
      'enrollments',
      'grades',
      'cohortMembers'
    ];

    this.userApiService.getById(id, relations).subscribe({
      next: (user: User) => {
        this.user = user;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error;
      }
    });
  }

  // Local storage methods for data persistance.

  /**
   * Retrieve the user model that is stored in the local storage.
   *
   * @returns User | null
   */
  protected retrieveUserFromLocalStorage(): User | null
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
   * @returns void
   */
  protected storeUserInLocalStorage(user: User): void
  {
    this.localStorageService.setItem('user', user);
  }

  /**
   * Remove the user model from the local storage
   *
   * @returns void
   */
  protected removeUserFromLocalStorage(): void
  {
    this.localStorageService.removeItem('user');
  }
}
