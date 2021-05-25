import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleEnum } from 'src/roles/role.enum';
import { RolesGuard } from 'src/roles/roles-guard';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

export function Auth(roles: Array<RoleEnum>) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
