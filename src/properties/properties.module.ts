import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PropertySaleMethodsModule } from 'src/property-sale-methods/property-sale-methods.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyRepository } from './property.repository';
import { PropertyDetailsModule } from 'src/property-details/property-details.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { GeolocationModule } from 'src/geolocation/geolocation.module';
import { PropertyListener } from './listeners/property.listener';
import { PusherService } from 'src/pusher/pusher.service';
import { PusherModule } from 'src/pusher/pusher.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    PropertySaleMethodsModule,
    PropertyDetailsModule,
    CompaniesModule,
    GeolocationModule,
    TypeOrmModule.forFeature([PropertyRepository]),
    PusherModule,
    NotificationsModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertyListener],
  exports: [PropertiesService],
})
export class PropertiesModule {}
