import Cohort from "./Cohort";
import CohortRole from "./CohortRole";
import Model from "./Model";
import User from "./User";

export default class CohortMember extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public user?: User;
  public cohort?: Cohort;
  public role: CohortRole;

  constructor(object: CohortMember) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    if (object.user)
      this.user = new User(object.user);

    if (object.cohort)
      this.cohort = new Cohort(object.cohort);

    this.role = new CohortRole(object.role);
  }
}
