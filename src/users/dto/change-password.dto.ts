import { ApiPropertyOptional } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';
import { Match } from 'src/_common/custom-class-validator/match.decorator';

export class ChangePasswordDto {
  @MaxLength(20)
  @MinLength(8)
  @ApiPropertyOptional()
  old_password: string;

  @MaxLength(20)
  @MinLength(8)
  @ApiPropertyOptional()
  new_password: string;

  @MaxLength(20)
  @MinLength(8)
  @Match('new_password')
  @ApiPropertyOptional()
  confirmed_new_password: string;
}
