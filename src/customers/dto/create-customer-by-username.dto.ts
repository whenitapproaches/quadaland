import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsAlphanumeric, MinLength } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

export class CreateCustomerByUsernameDto extends PickType(CreateCustomerDto, [
  'address',
  'email',
  'full_name',
  'phone',
]) {
  @IsAlphanumeric()
  @MinLength(8)
  @ApiProperty()
  username: string;
}
