import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import User from "../../models/User";
import { LoginRequestBody } from "../../types/auth/login-request-body";
import AuthApiService from "../api/auth-api.service";

@Injectable({ providedIn: 'root'})
export default class AuthStoreService
{
  private _user = new BehaviorSubject<User | null>(null);
  public user = this._user.asObservable();

  private _error = new BehaviorSubject<string | null>(null);
  public error = this._error.asObservable();

  constructor(
    private authApiService: AuthApiService,
  ) {
    //
  }

  public login(credentials: LoginRequestBody): void
  {
    this.authApiService.login(credentials).subscribe({
      next: (user: User) => {
        this._user.next(user);
        this._error.next(null);
      },
      error: (error: any) => {
        this._error.next(error.error.message);
      }
    });
  }
}
