import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { RoleEnum } from 'src/roles/role.enum';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Auth([RoleEnum.Superuser, RoleEnum.Admin])
  @Get()
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
