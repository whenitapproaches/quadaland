import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CoordinateDto } from 'src/_common/dto/coordinate.dto';

export class CreatePropertyDetailDto {
  @IsString()
  @MinLength(10)
  @ApiProperty({
    minLength: 10,
  })
  title: string;

  @IsString()
  @MinLength(50)
  @MaxLength(1000)
  @ApiProperty({
    minLength: 50,
    maxLength: 1000,
  })
  description: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @ApiPropertyOptional({
    minLength: 10,
  })
  address: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Area must be more than 0.',
  })
  area: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Price must be more than 0.',
  })
  price: number;

  @ValidateNested({
    each: true,
  })
  @IsNotEmptyObject()
  @Type(() => CoordinateDto)
  @Exclude({
    toPlainOnly: true,
  })
  @ApiProperty({
    description:
      'Coordinate must be an object containing latitude and longitude.',
    type: CoordinateDto,
  })
  coordinate: CoordinateDto;

  @Expose({
    toPlainOnly: true,
  })
  get latitude() {
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
