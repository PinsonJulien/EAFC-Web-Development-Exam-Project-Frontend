import Formation from "./Formation";
import Grade from "./Grade";
import Model from "./Model";
import User from "./User";

export default class Course extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public name: string;
  public status: boolean
  public teacher: User | null;

  public relations?: {
    formations?: Formation[];
    grades?: Grade[];
  };

  constructor(object: Course) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    this.name = object.name;
    this.status = object.status;

    this.teacher = (object.teacher) ? new User(object.teacher) : null;

    const relations = object.relations;

    if (relations) {
      this.relations = {};

      if (relations.formations)
        this.relations.formations = relations.formations.map((formation) => new Formation(formation));

      if (relations.grades)
        this.relations.grades = relations.grades.map((grade) => new Grade(grade));
    }
  }
}
