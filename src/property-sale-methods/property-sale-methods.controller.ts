import { Controller, Get } from '@nestjs/common';
import { PropertySaleMethodsService } from './property-sale-methods.service';

@Controller('property-sale-methods')
export class PropertySaleMethodsController {
  constructor(
    private readonly propertySaleMethodsService: PropertySaleMethodsService,
  ) {}

  @Get()
  findAll() {
    return this.propertySaleMethodsService.findAll();
  }
}
