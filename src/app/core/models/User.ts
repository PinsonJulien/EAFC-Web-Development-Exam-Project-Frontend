import CohortMember from "./CohortMember";
import Country from "./Country";
import Course from "./Course";
import Enrollment from "./Enrollment";
import Grade from "./Grade";
import Model from "./Model";
import SiteRole from "./SiteRole";

export type UserRelations = keyof NonNullable<User['relations']>;

export default class User extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public picture: string;

  public account?: {
    username: string;
    email: string;
    emailVerifiedAt: string;
    siteRole: SiteRole,
    lastLogin: Date| null;
  };

  public personal: {
    identity: {
      lastname: string;
      firstname: string;
      nationality?: Country;
      birthdate?: Date;
    };

    contact?: {
      phone: string;
      address: string;
      postalCode: string;
      country: Country;
    }
  }

  public relations?: {
    teacherCourses?: Course[];
    enrollments?: Enrollment[];
    grades?: Grade[];
    cohortMembers?: CohortMember[];
  };

  constructor(object: User) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    this.picture = object.picture;

    const account = object.account;
    if (account)
      this.account = {
        username: account.username,
        email: account.email,
        emailVerifiedAt: account.emailVerifiedAt,
        siteRole: new SiteRole(account.siteRole),
        lastLogin: (account.lastLogin) ? new Date(account.lastLogin) : null,
      };

    const identity = object.personal.identity;

    this.personal = {
      identity : {
        lastname: identity.lastname,
        firstname: identity.firstname,
      }
    };

    if (identity.nationality)
      this.personal.identity.nationality = new Country(identity.nationality);

    if (identity.birthdate)
      this.personal.identity.birthdate = new Date(identity.birthdate);


    const contact = object.personal.contact;
    if (contact)
      this.personal.contact = {
        phone: contact.phone,
        address: contact.address,
        postalCode: contact.postalCode,
        country: new Country(contact.country),
      };

    const relations = object.relations;
    if (relations) {
      this.relations = {};

      if (relations.teacherCourses)
        this.relations.teacherCourses = relations.teacherCourses.map((course) => new Course(course));

      if (relations.enrollments)
        this.relations.enrollments = relations.enrollments.map((enrollment) => new Enrollment(enrollment));

      if (relations.grades)
        this.relations.grades = relations.grades.map((grade) => new Grade(grade));

      if (relations.cohortMembers)
        this.relations.cohortMembers = relations.cohortMembers.map((cohortMember) => new CohortMember(cohortMember));
    }
  }


  // Methods


  /**
   * Checks if the user site role is Secretary
   *
   * @returns boolean
   */
  public isSecretary(): boolean
  {
    if (!this.account) return false;

    return (this.account.siteRole.isSecretary());
  }

  /**
   * Checks if the user site role is Administrator
   *
   * @returns boolean
   */
  public isAdministrator(): boolean
  {
    if (!this.account) return false;

    return (this.account.siteRole.isAdministrator());
  }


  /**
   * Checks if the user site role is Secretary or Administrator
   *
   * @returns boolean
   */
  public isSecretaryOrAdministrator(): boolean
  {
    return (this.isSecretary() || this.isAdministrator());
  }

  /**
   * Checks if the user site role is Banned.
   *
   * @returns boolean
   */
  public isBanned(): boolean
  {
    if (!this.account) return false;

    return this.account.siteRole.isBanned();
  }

}
