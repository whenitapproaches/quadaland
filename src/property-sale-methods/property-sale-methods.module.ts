import { Module } from '@nestjs/common';
import { PropertySaleMethodsService } from './property-sale-methods.service';
import { PropertySaleMethodsController } from './property-sale-methods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertySaleMethodRepository } from './property-sale-method.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PropertySaleMethodRepository])],
  controllers: [PropertySaleMethodsController],
  providers: [PropertySaleMethodsService],
  exports: [PropertySaleMethodsService],
})
export class PropertySaleMethodsModule {}
