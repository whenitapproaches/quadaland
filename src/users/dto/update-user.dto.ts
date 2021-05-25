import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @MaxLength(20)
  @MinLength(8)
  @IsOptional()
  @ApiPropertyOptional()
  password: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_active: boolean;
}
