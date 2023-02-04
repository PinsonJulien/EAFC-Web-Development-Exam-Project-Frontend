import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import User, { UserRelations } from "../../models/User";
import { RequestAction } from "../../types/requests/request-action.enum";
import { ApiService } from "./api.service";

@Injectable({providedIn: 'root'})
export default class UserApiService extends ApiService
{
  protected override readonly apiRoute: string = "api/v1/users";

  /**
   * Fetch a user by it's id and stream it as Observable.
   * On success the data is mapped to a User model.
   *
   * @param id number
   * @param relations UserRelations[] = []
   * @returns Observable<User>
   */
  public getById(id: number, relations: UserRelations[] = []): Observable<User>
  {
    const parameters: any = {};

    if (relations.length) {
      parameters.includeRelations = relations.join(',');
    }

    return this.request<User>(RequestAction.GET, id, parameters).pipe(
      map((response: any) => {
        return new User(response.data);
      })
    );
  }
}
