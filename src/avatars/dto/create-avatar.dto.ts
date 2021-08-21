import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAvatarDto {
  @IsString({
    each: true,
  })
  @ApiProperty({
    description: 'Media slug.',
  })
  media: string;
}
