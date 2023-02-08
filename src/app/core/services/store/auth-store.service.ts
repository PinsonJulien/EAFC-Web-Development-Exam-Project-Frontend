import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, first, skip } from "rxjs";
import User, { UserRelations } from "../../models/User";
import { ApiError } from "../../types/api/api-error";
import { LoginRequestBody } from "../../types/auth/login-request-body";
import { RegisterRequestBody } from "../../types/auth/register-request-body";
import AuthApiService from "../api/auth-api.service";
import UserApiService from "../api/user-api.service";
import { LocalStorageService } from "../local-storage/local-storage.service";
import StoreService from "./store.service";

@Injectable({ providedIn: 'root'})
export default class AuthStoreService extends StoreService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  protected _user = new BehaviorSubject<User | null>(null);
  public user$ = this._user.asObservable();

  /**************************************************/
  //
  // Constructor
  //
  /**************************************************/

  constructor(
    protected authApiService: AuthApiService,
    protected localStorageService: LocalStorageService,
    protected userApiService: UserApiService,
    protected router: Router,
  ) {
    super();

    // On instantiation, the store service will retrieve the locally stored user.
    const userId = this.retrieveUserFromLocalStorage();

    // If the store is empty, redirects to login.
    if (!userId) {
      this.router.navigate(['login']);
      return;
    }

    // Refresh the user using the api service.
    this.refreshUserById(userId);

    // Listen to user to automatically redirect.
    this.user$
    .pipe(skip(1), first())
    .subscribe((user : User|null) => {
      if (!user)
        this.router.navigate(['login']);

      this.router.navigate(['home']);
    });
  }

  /**************************************************/
  //
  // Getters / setters
  //
  /**************************************************/

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
   * @param user User | null
   * @returns void
   */
  protected set user(user: User | null)
  {
    if (!user) this.removeUserFromLocalStorage();
    else this.storeUserInLocalStorage(user);

    this._user.next(user);
  }

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

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
   * Call the refreshById method using the logged user id.
   * This method role is to allow public usage of user refresh, without dealing with the user data.
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

    this.refreshUserById(this.user.id);
  }

  /**
   * Refresh the data of the logged user and update it's behavior subject.
   * Uses the UserApiService getById and asks for specific relations to be included.
   *
   * @param id number
   * @returns void
   */
  protected refreshUserById(id: number): void
  {
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

  /**************************************************/
  //
  // Data persistance methods (Local storage)
  //
  /**************************************************/

  /**
   * Retrieve the user id that is stored in the local storage.
   *
   * @returns number | null
   */
  protected retrieveUserFromLocalStorage(): number | null
  {
    const userId = this.localStorageService.getItem('userId');

    return userId ?? null;
  }

  /**
   * Store the user id to the local storage for data persistance.
   *
   * @param user User
   * @returns void
   */
  protected storeUserInLocalStorage(user: User): void
  {
    this.localStorageService.setItem('userId', user.id);
  }

  /**
   * Remove the user id from the local storage
   *
   * @returns void
   */
  protected removeUserFromLocalStorage(): void
  {
    this.localStorageService.removeItem('userId');
  }
}
