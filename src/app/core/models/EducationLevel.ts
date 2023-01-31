import Formation from "./Formation";
import Model from "./Model";

export default class EducationLevel extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public name: string;


  public relations?: {
    formations?: Formation[];
  };

  constructor(object: EducationLevel) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    this.name = object.name;

    const relations = object.relations;
    if (relations) {
      this.relations = {};

      if (relations.formations)
        this.relations.formations = relations.formations.map((formation) => new Formation(formation));
    }
  }
}
