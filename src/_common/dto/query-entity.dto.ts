import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsPositive, Min } from 'class-validator';

const PER_PAGE_ALLOWS = [10, 25, 50, 100];

const DEFAULTS = {
  per_page: PER_PAGE_ALLOWS[0],
  page: 1,
};

export class QueryEntityDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsIn(PER_PAGE_ALLOWS)
  @ApiPropertyOptional({
    default: DEFAULTS.per_page,
    enum: PER_PAGE_ALLOWS,
  })
  per_page: number = DEFAULTS.per_page;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    default: DEFAULTS.page,
  })
  page: number = DEFAULTS.page;
}
