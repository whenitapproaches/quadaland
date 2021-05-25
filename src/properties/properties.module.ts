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

@Module({
  imports: [
    PropertySaleMethodsModule,
    PropertyDetailsModule,
    CompaniesModule,
    GeolocationModule,
    TypeOrmModule.forFeature([PropertyRepository]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertyListener],
  exports: [PropertiesService],
})
export class PropertiesModule {}
