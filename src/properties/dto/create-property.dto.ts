import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePropertyDetailDto } from 'src/property-details/dto/create-property-detail.dto';
import { PropertySaleMethodsEnum } from 'src/property-sale-methods/property-sale-methods.enum';

export class CreatePropertyDto {
  @IsString()
  @MinLength(5)
  @IsOptional()
  @Matches('^[a-z0-9]+(?:-[a-z0-9]+)*$', 'g', {
    message: 'Slug must be formatted in kebab-case.',
  })
  @Exclude({
    toPlainOnly: true,
  })
  @ApiPropertyOptional({
    description: 'Slug is not allowed if requester contains role company.',
  })
  slug: string;

  @IsEnum(PropertySaleMethodsEnum)
  @Exclude({
    toPlainOnly: true,
  })
  @ApiProperty({
    enum: PropertySaleMethodsEnum,
  })
  sale_method: PropertySaleMethodsEnum;

  @ValidateNested({
    each: true,
  })
  @Exclude({
    toPlainOnly: true,
  })
  @IsNotEmptyObject()
  @Type(() => CreatePropertyDetailDto)
  @ApiProperty({
    type: CreatePropertyDetailDto,
  })
  details: CreatePropertyDetailDto;
}
