import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsAlphanumeric()
  @MaxLength(20)
  @MinLength(8)
  @ApiProperty()
  username: string;

  @MaxLength(20)
  @MinLength(8)
  @ApiProperty()
  password: string;
}
