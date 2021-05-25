import { Injectable, NotFoundException } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { PropertySaleMethodRepository } from './property-sale-method.repository';
import { PropertySaleMethodsEnum } from './property-sale-methods.enum';

@Injectable()
export class PropertySaleMethodsService {
  constructor(
    private readonly propertySaleMethodRepository: PropertySaleMethodRepository,
  ) {}

  async findAll() {
    const methods = await this.propertySaleMethodRepository.find();
    return {
      data: classToPlain(methods),
    };
  }

  async findOneOrFail(saleMethodName: PropertySaleMethodsEnum) {
    const method = await this.propertySaleMethodRepository.findOne({
      name: saleMethodName,
    });

    if (!method)
      throw new NotFoundException({
        message: 'not_found.read.property_sale_method',
      });

    return method;
  }
}
