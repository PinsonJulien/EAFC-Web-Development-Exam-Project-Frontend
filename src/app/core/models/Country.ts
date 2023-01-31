import Model from "./Model";
import User from "./User";

export default class Country extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public name: string;
  public iso: string;

  public relations?: {
    nationalityUsers?: User[];
    addressUsers?: User[];
  };

  constructor(object: Country) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    this.name = object.name;
    this.iso = object.iso;

    const relations = object.relations;
    if (relations) {
      this.relations = {};

      if (relations.nationalityUsers)
        this.relations.nationalityUsers = relations.nationalityUsers.map((user) => new User(user));

      if (relations.addressUsers)
        this.relations.addressUsers = relations.addressUsers.map((user) => new User(user));
    }
  }
}
