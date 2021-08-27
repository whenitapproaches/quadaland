import { RoleEnum } from 'src/roles/role.enum';

export const pusherChannels = {
  customers: [RoleEnum.Customer],
  'private-companies': [RoleEnum.Company],
  'private-moderators': [RoleEnum.Admin, RoleEnum.Superuser],
  'private-admin': [RoleEnum.Admin],
  'private-superuser': [RoleEnum.Superuser],
  'private-customers': [RoleEnum.Customer],
};
