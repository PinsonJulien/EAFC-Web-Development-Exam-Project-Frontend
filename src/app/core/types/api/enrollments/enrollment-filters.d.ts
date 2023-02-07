import Formation from "src/app/core/models/Formation";
import Status from "src/app/core/models/Status";
import User from "src/app/core/models/User";

export declare type EnrollmentFilters = {
  formationId?: Formation['id'];
  statusId?: Status['id'];
  userId?: User['id'];
};
