import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { QueryEntityDto } from 'src/_common/dto/query-entity.dto';

const sortableFields = ['created_at', 'file_name', 'file_size'].reduce(
  (accumulator, field) => [
    ...accumulator,
    `+${field}`,
    `${field}`,
    `-${field}`,
  ],
  [],
);

export class QueryMediaEntityDto extends QueryEntityDto {
  @IsString()
  @IsOptional()
  @MinLength(5)
  @ApiPropertyOptional({
    type: String,
    description: 'Filter media by the company user posting property.',
  })
  username: string;

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
