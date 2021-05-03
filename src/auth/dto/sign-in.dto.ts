import { IsAlphanumeric, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsAlphanumeric()
  @MaxLength(50)
  @MinLength(8)
  username: string;

  @MaxLength(50)
  @MinLength(8)
  password: string;
}
