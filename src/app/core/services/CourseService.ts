import { Injectable } from "@angular/core";
import { map, tap } from "rxjs";
import Course from "../models/Course";
import { ApiService } from "./ApiService";
import { RequestAction } from "./Types/Requests/RequestAction";

@Injectable({ providedIn: 'root'})
export default class CourseService extends ApiService {

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
