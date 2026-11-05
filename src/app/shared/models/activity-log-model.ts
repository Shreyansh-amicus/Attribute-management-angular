
export type ActivityAction = 'CREATE' | 'EDIT' | 'DELETE';

export interface ActivityLogModel {
  id: number;
  action: ActivityAction;
  attributeId: number;
  attributeName: string;
  performedBy: string;
  timestamp: Date;
}
