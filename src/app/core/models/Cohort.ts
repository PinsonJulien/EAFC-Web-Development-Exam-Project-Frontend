import CohortMember from "./CohortMember";
import Formation from "./Formation";
import Model from "./Model";

export default class Cohort extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public name: string;
  public formation: Formation;

  public relations?: {
    cohortMembers?: CohortMember[];
  }

  constructor(object: Cohort) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    this.name = object.name;
    this.formation = new Formation(object.formation);

    const relations = object.relations;
    if (relations) {
      this.relations = {};

      if (relations.cohortMembers)
        this.relations.cohortMembers = relations.cohortMembers.map((cohortMember) => new CohortMember(cohortMember));
    }
  }
}
