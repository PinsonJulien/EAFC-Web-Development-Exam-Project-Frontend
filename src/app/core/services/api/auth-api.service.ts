import { Injectable } from "@angular/core";
import { map } from "rxjs";
import User from "../../models/User";
import { ApiService } from "./api.service";
import { RequestAction } from "../Types/Requests/RequestAction";

@Injectable({providedIn: 'root'})
export default class AuthApiService extends ApiService
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

  public register(body: RegisterRequestBody, picture?: File)
  {
    // Object body must be converted to a FormData to be able to send the picture.
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      formData.append(key, String(value))
    }

    if (picture)
      formData.append('picture', picture);


    return this.request(RequestAction.POST, 'register', {}, formData).pipe(
      map((response: any) => {
        return new User(response.data);
      })
    )
  }
}
