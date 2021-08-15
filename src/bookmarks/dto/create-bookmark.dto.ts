import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateBookmarkDto {
  @IsNumber()
  @ApiProperty()
  property_id: number;
}
