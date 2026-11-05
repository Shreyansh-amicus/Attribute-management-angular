import { ActivityAction } from "./activity-log-model";

export interface ActivityLogDTO {
  attribute_id: number;
  related_attribute_id: number;
  action: ActivityAction;
  attribute_name: string;
  performed_by: string;
  timestamp: string;
}

export type CreateActivityLogDTO = Omit<
  ActivityLogDTO,
  'attribute_id'
>;