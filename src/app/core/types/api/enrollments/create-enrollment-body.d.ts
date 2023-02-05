import Formation from "src/app/core/models/Formation";
import User from "src/app/core/models/User";

export declare type CreateEnrollmentBody = {
  formationId: Formation['id'];
  userId: User['id'];
};
