import Model from "./Model";
import User from "./User";

export default class SiteRole extends Model
{
  // Constants
  public static readonly GUEST = 1;
  public static readonly USER = 2;
  public static readonly SECRETARY = 3;
  public static readonly ADMINISTRATOR = 4;
  public static readonly BANNED = 5;

  // Properties
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

  // Methods

  /**
   * Checks if the site role is secretary
   *
   * @returns boolean
   */
  public isSecretary(): boolean
  {
    return this.id === SiteRole.SECRETARY;
  }

  /**
   * Checks if the site role is administrator
   *
   * @returns boolean
   */
  public isAdministrator(): boolean
  {
    return this.id === SiteRole.ADMINISTRATOR;
  }

  /**
   * Checks if the site role is banned
   *
   * @returns boolean
   */
  public isBanned(): boolean
  {
    return this.id === SiteRole.BANNED;
  }

}
