import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
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
}
