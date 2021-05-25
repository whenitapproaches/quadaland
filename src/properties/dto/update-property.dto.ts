import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { UpdatePropertyDetailDto } from 'src/property-details/dto/update-property-detail.dto';
import { PropertySaleMethodsEnum } from 'src/property-sale-methods/property-sale-methods.enum';
import { CreatePropertyDto } from './create-property.dto';

export class UpdatePropertyDto extends PickType(CreatePropertyDto, ['slug']) {
  @ValidateNested({
    each: true,
  })
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @Type(() => UpdatePropertyDetailDto)
  @ApiPropertyOptional({
    type: UpdatePropertyDetailDto,
  })
  details: UpdatePropertyDetailDto;

  @IsEnum(PropertySaleMethodsEnum)
  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @ApiPropertyOptional({
    enum: PropertySaleMethodsEnum,
  })
  sale_method: PropertySaleMethodsEnum;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  approval_status: boolean;
}
