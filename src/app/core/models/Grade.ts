import Course from "./Course";
import Model from "./Model";
import User from "./User";

export default class Grade extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public user?: User;
  public course?: Course;
  public score: number;

  constructor(object: Grade) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    if (object.user)
      this.user = new User(object.user);

    if (object.course)
      this.course = new Course(object.course);

    this.score = object.score;
  }
}
