import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  @IsOptional()
  @ApiPropertyOptional({
    maxLength: 100,
    minLength: 5,
    type: String,
  })
  full_name: string;

  @IsNumberString()
  @MaxLength(12)
  @MinLength(8)
  @IsOptional()
  @ApiPropertyOptional({
    maxLength: 100,
    minLength: 5,
    type: String,
  })
  phone: string;

  @IsString()
  @MaxLength(100)
  @MinLength(20)
  @IsOptional()
  @ApiPropertyOptional({
    maxLength: 100,
    minLength: 20,
    type: String,
  })
  address: string;

  @IsEmail()
  @MaxLength(100)
  @MinLength(5)
  @IsOptional()
  @ApiPropertyOptional({
    maxLength: 100,
    minLength: 5,
    type: String,
  })
  email: string;

  @MinLength(5)
  @IsOptional()
  @ApiPropertyOptional({
    minLength: 5,
    type: String,
  })
  facebook: string;

  @MinLength(5)
  @IsOptional()
  @ApiPropertyOptional({
    minLength: 5,
    type: String,
  })
  instagram: string;

  @MinLength(5)
  @IsOptional()
  @ApiPropertyOptional({
    minLength: 5,
    type: String,
  })
  twitter: string;

  user: UserEntity;
}
