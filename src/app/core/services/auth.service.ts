import { Injectable } from "@angular/core";
import { map } from "rxjs";
import User from "../models/User";
import { ApiService } from "./api.service";
import { RequestAction } from "./Types/Requests/RequestAction";

@Injectable({providedIn: 'root'})
export default class AuthService extends ApiService
{
  protected override readonly apiRoute: string = "api/v1/auth";

  public login(body: {email: string, password: string})
  {
    return this.request(RequestAction.POST, 'login', {}, body).pipe(
      map((response: any) => {
        return new User(response.data);
      })
    );
  }

  public register(body: RegisterRequestBody)
  {
    return this.request(RequestAction.POST, 'register', {}, body).pipe(
      map((response: any) => {
        return new User(response.data);
      })
    )
  }
}
