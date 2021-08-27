import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBooleanString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleEnum } from 'src/roles/role.enum';
import { QueryEntityDto } from 'src/_common/dto/query-entity.dto';

export class QueryUserEntityDto extends QueryEntityDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search: string;

  @IsEnum(RoleEnum)
  @IsOptional()
  @ApiPropertyOptional()
  role: RoleEnum;

  @IsBooleanString()
  @IsOptional()
  @ApiPropertyOptional()
  is_active: boolean;

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
