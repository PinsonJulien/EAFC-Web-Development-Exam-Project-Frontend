import Model from "./Model";
import User from "./User";

export default class SiteRole extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public name: string;

  public relations?: {
    users?: User[];
  };

  constructor(object: SiteRole) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    this.name = object.name;

    const relations = object.relations;
    if (relations) {
      this.relations = {};

      if (relations.users)
        this.relations.users = relations.users.map((user) => new User(user));
    }
  }
}
