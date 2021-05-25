import { Controller, Get } from '@nestjs/common';
import { RoleEnum } from 'src/roles/role.enum';
import { Auth } from 'src/auth/auth.decorator';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Auth([RoleEnum.Superuser])
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
