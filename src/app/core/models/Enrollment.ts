import Formation from "./Formation";
import Model from "./Model";
import Status from "./Status";
import User from "./User";

export default class Enrollment extends Model
{
  // Properties

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public user?: User;
  public formation?: Formation;
  public status: Status;
  public message: string;

  constructor(object: Enrollment) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    if (object.user)
      this.user = new User(object.user);

    if (object.formation)
      this.formation = new Formation(object.formation);

    this.status = new Status(object.status);
    this.message = object.message;
  }

  // Methods

  /**
   * Checks if the enrollment has a pending status.
   *
   * @returns boolean
   */
  public isPending(): boolean
  {
    return this.status.isPending();
  }

  /**
  * Checks if the enrollment has a approved status.
  *
  * @returns boolean
  */
  public isApproved(): boolean
  {
    return this.status.isApproved();
  }

}
