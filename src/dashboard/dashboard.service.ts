import { Injectable } from '@nestjs/common';
import { PropertiesService } from 'src/properties/properties.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly propertiesService: PropertiesService,
  ) {}

  getDashboard() {
    return '5';
  }
}
