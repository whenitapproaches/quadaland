import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MediaVisibilityEnum } from '../media-visibility.enum';

export class UpdateMediaDto {
  @IsEnum(MediaVisibilityEnum)
  @ApiPropertyOptional({
    enum: MediaVisibilityEnum,
  })
  visibility: MediaVisibilityEnum;
}
