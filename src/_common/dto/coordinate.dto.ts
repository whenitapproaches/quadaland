import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';

export class CoordinateDto {
  @IsLatitude()
  @ApiProperty()
  latitude: string;

  @IsLongitude()
  @ApiProperty()
  longitude: string;
}
