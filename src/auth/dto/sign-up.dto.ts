import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class SignUpDto extends SignInDto {
  @IsEmail()
  @MaxLength(100)
  @MinLength(5)
  @ApiProperty({
    maxLength: 100,
    minLength: 5,
    type: String,
  })
  email: string;
}
