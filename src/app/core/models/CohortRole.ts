import CohortMember from "./CohortMember";
import Model from "./Model";

export default class CohortRole extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public name: string;

  public relations?: {
    cohortMembers?: CohortMember[];
  }

  constructor(object: CohortRole) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    this.name = object.name;

    const relations = object.relations;
    if (relations) {
      this.relations = {};

      if (relations.cohortMembers)
        this.relations.cohortMembers = relations.cohortMembers.map((cohortMember) => new CohortMember(cohortMember));
    }
  }
}
