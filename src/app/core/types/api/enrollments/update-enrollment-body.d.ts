import Status from "src/app/core/models/Status";

export declare type UpdateEnrollmentBody = {
  statusId: Status['id'];
  message?: string;
};
