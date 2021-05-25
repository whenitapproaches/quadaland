import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CoordinateDto } from 'src/_common/dto/coordinate.dto';
import { CreatePropertyDetailDto } from './create-property-detail.dto';

export class UpdatePropertyDetailDto extends CreatePropertyDetailDto {
  @IsString()
  @IsOptional()
  @MinLength(10)
  @ApiPropertyOptional({
    minLength: 10,
  })
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(50)
  @MaxLength(1000)
  @ApiPropertyOptional({
    minLength: 50,
    maxLength: 1000,
  })
  description: string;

  @ValidateNested({
    each: true,
  })
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => CoordinateDto)
  @Exclude({
    toPlainOnly: true,
  })
  @ApiPropertyOptional({
    description:
      'Coordinate must be an object containing latitude and longitude.',
    type: CoordinateDto,
  })
  coordinate: CoordinateDto;

  @Expose({
    name: 'latitude',
    toPlainOnly: true,
  })
  getLatitude() {
    return this.coordinate?.latitude;
  }

  @Expose({
    name: 'longitude',
    toPlainOnly: true,
  })
  getLongitude() {
    return this.coordinate?.longitude;
  }

  @IsString({
    each: true,
  })
  @Exclude({
    toPlainOnly: true,
  })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Array of media slugs.',
  })
  media: Array<string>;
}
