import Cohort from "./Cohort";
import Course from "./Course";
import EducationLevel from "./EducationLevel";
import Enrollment from "./Enrollment";
import Model from "./Model";

export default class Formation extends Model {

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public name: string;
  public status: boolean;
  public startDate: Date;
  public endDate: Date;
  public educationLevel: EducationLevel;

  public relations?: {
    courses?: Course[];
    enrollments?: Enrollment[];
    cohorts?: Cohort[];
  };

  constructor(object: Formation) {
    super();

    this.id = object.id;
    this.createdAt = new Date(object.createdAt);
    this.updatedAt = new Date(object.updatedAt);

    this.name = object.name;
    this.status = object.status;
    this.startDate = new Date(object.startDate);
    this.endDate = new Date(object.endDate);
    this.educationLevel = new EducationLevel(object.educationLevel);

    const relations = object.relations;
    if (relations) {
      this.relations = {};

      if (relations.courses)
        this.relations.courses = relations.courses.map((course) => new Course(course));

      if (relations.enrollments)
        this.relations.enrollments = relations.enrollments.map((enrollment) => new Enrollment(enrollment));

      if (relations.cohorts)
        this.relations.cohorts = relations.cohorts.map((cohort) => new Cohort(cohort));
    }
  }
}
