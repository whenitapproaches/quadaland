import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { QueryEntityDto } from 'src/_common/dto/query-entity.dto';

export class QueryCompanyEntityDto extends QueryEntityDto {
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsIn(['+created_at', '-created_at'], {
    each: true,
  })
  @ApiPropertyOptional({
    description: 'Place a minus before sorting fields to order by descending.',
    enum: ['+created_at', '-created_at'],
  })
  sort_by: Array<string>;
}
