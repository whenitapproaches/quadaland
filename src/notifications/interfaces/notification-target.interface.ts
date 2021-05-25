export interface NotificationTargetInterface {
  id: any;
  type: TargetTypes;
}

export enum TargetTypes {
  Property = 'property',
  User = 'user',
}
