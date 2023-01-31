import Enrollment from "./Enrollment";
import Model from "./Model";

export default class Status extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public name: string;

  public relations?: {
    enrollments?: Enrollment[];
  }

  constructor(object: Status) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    this.name = object.name;

    const relations = object.relations;
    if (relations) {
      this.relations = {};

      if (relations.enrollments)
        this.relations.enrollments = relations.enrollments.map((enrollment) => new Enrollment(enrollment));
    }
  }
}
