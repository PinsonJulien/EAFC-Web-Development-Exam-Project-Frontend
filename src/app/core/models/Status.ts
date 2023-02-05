import Enrollment from "./Enrollment";
import Model from "./Model";

export default class Status extends Model
{
  // Constants
  public static readonly PENDING = 1;
  public static readonly APPROVED = 2;
  public static readonly DENIED = 3;
  public static readonly CANCELLED = 4;
  public static readonly EXPIRED = 5;
  public static readonly SUSPENDED = 6;

  // Properties
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

  // Methods

  /**
   * Checks if the status is pending.
   *
   * @returns boolean
   */
  public isPending(): boolean
  {
    return this.id === Status.PENDING;
  }

  /**
   * Checks if the status is approved.
   *
   * @returns boolean
   */
  public isApproved(): boolean
  {
    return this.id === Status.APPROVED;
  }

}
