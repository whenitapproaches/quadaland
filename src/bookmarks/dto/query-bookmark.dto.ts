import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { QueryEntityDto } from 'src/_common/dto/query-entity.dto';

const sortableFields = ['created_at', '-created_at', '+created_at'];

export class QueryBookmarkEntityDto extends QueryEntityDto {
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
