import { Injectable } from "@angular/core";
import { map } from "rxjs";
import Course from "../../models/Course";
import { RequestAction } from "../Types/Requests/RequestAction";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root'})
export default class CourseApiService extends ApiService {

  public getAll()
  {
    return this.request(RequestAction.GET, 'courses', {}, {})
      .pipe(
        map( (response: any) => {
          return response.data.map((course: Course) => new Course(course))
        })
      );
  }

  public getById()
  {

  }
}