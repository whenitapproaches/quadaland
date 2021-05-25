import { PickType } from '@nestjs/swagger';
import { IsAlphanumeric, MinLength } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class CreateCompanyByUsernameDto extends PickType(CreateCompanyDto, [
  'address',
  'email',
  'full_name',
  'phone',
  'facebook',
  'instagram',
  'twitter',
]) {
  @IsAlphanumeric()
  @MinLength(8)
  username: string;
}
