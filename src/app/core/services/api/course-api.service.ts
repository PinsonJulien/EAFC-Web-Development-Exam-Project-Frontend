import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root'})
export default class CourseApiService extends ApiService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  protected override readonly apiRoute: string = "api/v1/courses";

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

  //

}
