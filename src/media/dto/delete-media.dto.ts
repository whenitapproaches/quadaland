import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum } from 'class-validator';

export class DeleteMediaDto {
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @ApiProperty()
  slugs: Array<string>;
}
