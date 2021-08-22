import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';

@Module({
  imports: [UsersModule, PropertiesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
