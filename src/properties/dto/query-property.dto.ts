import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { PropertySaleMethodsEnum } from 'src/property-sale-methods/property-sale-methods.enum';
import { ArraySizeNotEquals } from 'src/_common/custom-class-validator/array-size-not-equals.decorator';
import { IsCoordinateString } from 'src/_common/custom-class-validator/coordinate-string.decorator';
import { IsGreaterThan } from 'src/_common/custom-class-validator/is-greater-than.decorator';
import { IsLessThan } from 'src/_common/custom-class-validator/is-less-than.decorator';
import { QueryEntityDto } from 'src/_common/dto/query-entity.dto';
import { PropertySortableFields } from '../property-sortable-fields';

const sortableFields = Object.keys(PropertySortableFields).reduce(
  (accumulator, field) => [
    ...accumulator,
    `+${field}`,
    `${field}`,
    `-${field}`,
  ],
  [],
);

export class QueryPropertyEntityDto extends QueryEntityDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  @ArrayUnique()
  @ArraySizeNotEquals(2)
  @IsCoordinateString({
    each: true,
  })
  @Transform(
    ({ value: coordinates }) =>
      coordinates.map((coordinate) => ({
        latitude: coordinate.split(',')[0],
        longitude: coordinate.split(',')[1],
      })),
    {
      toPlainOnly: true,
    },
  )
  @ApiPropertyOptional({
    type: Array,
    maxLength: 8,
    minLength: 1,
    description:
      'Coordinates must be a set of strings following format {latitude, longitude} with maximum length of 8 and minimum length of 1.',
  })
  @IsOptional()
  coordinates: Set<string>;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsPositive()
  @Max(10)
  @ValidateIf(
    (o) =>
      o.coordinates &&
      Array.isArray(o.coordinates) &&
      o.coordinates.length === 1,
  )
  @ApiPropertyOptional({
    type: Number,
    description:
      'Radius must be a positive number with maximum of 10 and allowed only if there is one coordinate in query parameters.\nUnit: kilometer.',
  })
  radius: number;

  @IsEnum(PropertySaleMethodsEnum)
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
  })
  sale_method: PropertySaleMethodsEnum;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @ApiPropertyOptional({
    type: String,
    description: 'Filter properties by the user posting property.',
  })
  username: string;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsPositive()
  @IsLessThan('max_price', {
    message: 'Minimum price must be less than maximum price.',
  })
  @IsOptional()
  @ApiPropertyOptional()
  min_price: number;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsPositive()
  @IsGreaterThan('min_price', {
    message: 'Maximum price must be greater than minimum price.',
  })
  @IsOptional()
  @ApiPropertyOptional()
  max_price: number;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsPositive()
  @IsLessThan('max_area', {
    message: 'Minimum area must be less than maximum area.',
  })
  @IsOptional()
  @ApiPropertyOptional()
  min_area: number;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsPositive()
  @IsGreaterThan('min_area', {
    message: 'Maximum area must be greater than minimum area.',
  })
  @IsOptional()
  @ApiPropertyOptional()
  max_area: number;

  @IsString()
  @MinLength(5)
  @IsOptional()
  @ApiPropertyOptional({
    minLength: 5,
  })
  search: string;

  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsIn(sortableFields, {
    each: true,
  })
  @ApiPropertyOptional({
    description: 'Place a minus before sorting fields to order by descending.',
    enum: sortableFields,
  })
  sort_by: Array<string>;
}
