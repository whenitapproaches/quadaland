import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, NotEquals } from 'class-validator';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { RoleEnum } from 'src/roles/role.enum';

export class CreateUserDto extends SignInDto {
  @IsEnum(RoleEnum)
  @NotEquals(RoleEnum.Superuser)
  @ApiProperty()
  role: RoleEnum;
}
