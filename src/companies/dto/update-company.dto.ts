import { PickType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PickType(CreateCompanyDto, [
  'address',
  'email',
  'full_name',
  'phone',
  'facebook',
  'instagram',
  'twitter',
]) {}
